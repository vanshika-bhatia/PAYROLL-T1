/**
 * Recruitment Kanban Board [BHATIA-T1]
 * Core Application Logic: jQuery 3.7 + jQuery UI Sortable + Dual API/LocalStorage
 */

(function($) {
  'use strict';

  // Application State
  const AppState = {
    candidates: [],
    apiMode: 'LOCAL_STORAGE', // 'JSON_SERVER' or 'LOCAL_STORAGE'
    apiBaseUrl: 'http://localhost:3000/candidates',
    storageKey: 'bhatia_recruitment_candidates',
    currentFilterQuery: '',
    selectedCandidateId: null,
    wipLimits: {
      interview: 10
    },
    undoStack: []
  };

  // Helper: Capitalize / Format Stage
  function formatStage(stage) {
    if (!stage) return '';
    const map = {
      applied: 'Applied',
      screening: 'Screening',
      interview: 'Interview',
      hired: 'Hired',
      rejected: 'Rejected'
    };
    return map[stage] || stage.charAt(0).toUpperCase() + stage.slice(1);
  }

  // Helper: Score Styling Class
  function getScoreClass(score) {
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-average';
    return 'score-low';
  }

  // Helper: Format Date String
  function formatDate(isoStr) {
    if (!isoStr) return 'Recently';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
             ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch(e) {
      return isoStr;
    }
  }

  // ==========================================================================
  // API & Data Access Layer (JSON Server with LocalStorage Fallback)
  // ==========================================================================

  const ApiClient = {
    // Probe JSON Server to determine mode
    checkConnection: function() {
      return new Promise((resolve) => {
        $.ajax({
          url: AppState.apiBaseUrl + '?_limit=1',
          method: 'GET',
          timeout: 1200
        }).done(function() {
          AppState.apiMode = 'JSON_SERVER';
          ApiClient.updateServerStatusUI(true);
          resolve(true);
        }).fail(function() {
          AppState.apiMode = 'LOCAL_STORAGE';
          ApiClient.updateServerStatusUI(false);
          resolve(false);
        });
      });
    },

    updateServerStatusUI: function(isOnline) {
      const $badge = $('#serverStatusBadge');
      if (isOnline) {
        $badge.removeClass('offline').addClass('online')
          .html('<span class="status-dot"></span><span>JSON Server Active (Port 3000)</span>');
        $badge.attr('title', 'Connected to http://localhost:3000/candidates. Click to refresh connection.');
      } else {
        $badge.removeClass('online').addClass('offline')
          .html('<span class="status-dot"></span><span>LocalStorage Mode (Offline Fallback)</span>');
        $badge.attr('title', 'JSON Server not detected on :3000. Changes are securely saved in LocalStorage. Click to retry server.');
      }
    },

    // Fetch Candidates (from JSON Server or LocalStorage)
    fetchCandidates: function() {
      return new Promise((resolve, reject) => {
        if (AppState.apiMode === 'JSON_SERVER') {
          $.ajax({
            url: AppState.apiBaseUrl,
            method: 'GET',
            dataType: 'json'
          }).done(function(data) {
            AppState.candidates = data;
            // Also keep local storage synchronized as backup
            localStorage.setItem(AppState.storageKey, JSON.stringify(data));
            resolve(data);
          }).fail(function(err) {
            console.warn('JSON Server fetch failed, falling back to LocalStorage', err);
            AppState.apiMode = 'LOCAL_STORAGE';
            ApiClient.updateServerStatusUI(false);
            resolve(ApiClient.loadFromLocalStorage());
          });
        } else {
          resolve(ApiClient.loadFromLocalStorage());
        }
      });
    },

    loadFromLocalStorage: function() {
      let stored = localStorage.getItem(AppState.storageKey);
      if (stored) {
        try {
          AppState.candidates = JSON.parse(stored);
          return AppState.candidates;
        } catch (e) {
          console.error('Error parsing stored candidates, loading defaults', e);
        }
      }
      
      // Fallback to window.DEFAULT_CANDIDATES
      if (window.DEFAULT_CANDIDATES && Array.isArray(window.DEFAULT_CANDIDATES)) {
        AppState.candidates = JSON.parse(JSON.stringify(window.DEFAULT_CANDIDATES));
      } else {
        AppState.candidates = [];
      }
      localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.candidates));
      return AppState.candidates;
    },

    // Patch Candidate Stage via AJAX PATCH /candidates/:id or LocalStorage
    patchStage: function(candidateId, newStage, prevStage, customNote) {
      const candidate = AppState.candidates.find(c => c.id === candidateId);
      if (!candidate) return Promise.reject(new Error('Candidate not found'));

      // Update in-memory state
      candidate.stage = newStage;
      if (!candidate.timeline) candidate.timeline = [];
      
      const timelineEntry = {
        action: `Moved to ${formatStage(newStage)}`,
        stage: newStage,
        timestamp: new Date().toISOString(),
        actor: 'Recruiter (Kanban Move)',
        note: customNote || `Candidate pipeline stage updated from ${formatStage(prevStage)} to ${formatStage(newStage)}.`
      };
      candidate.timeline.unshift(timelineEntry);

      // Persist in LocalStorage
      localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.candidates));

      // If JSON Server is active, trigger AJAX PATCH /candidates/:id
      if (AppState.apiMode === 'JSON_SERVER') {
        return $.ajax({
          url: `${AppState.apiBaseUrl}/${candidateId}`,
          method: 'PATCH',
          contentType: 'application/json',
          data: JSON.stringify({
            stage: newStage,
            timeline: candidate.timeline
          })
        }).fail(function(xhr, status, error) {
          console.warn(`AJAX PATCH /candidates/${candidateId} failed; stored in LocalStorage.`, error);
        });
      }

      return Promise.resolve(candidate);
    },

    // Add Note to Candidate
    addNote: function(candidateId, noteText) {
      const candidate = AppState.candidates.find(c => c.id === candidateId);
      if (!candidate) return Promise.reject(new Error('Candidate not found'));

      if (!candidate.timeline) candidate.timeline = [];
      const entry = {
        action: 'Interviewer Assessment Note',
        stage: candidate.stage,
        timestamp: new Date().toISOString(),
        actor: 'Hiring Team',
        note: noteText
      };
      candidate.timeline.unshift(entry);

      localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.candidates));

      if (AppState.apiMode === 'JSON_SERVER') {
        return $.ajax({
          url: `${AppState.apiBaseUrl}/${candidateId}`,
          method: 'PATCH',
          contentType: 'application/json',
          data: JSON.stringify({
            timeline: candidate.timeline
          })
        });
      }
      return Promise.resolve(candidate);
    },

    // Reset back to initial 50 candidates
    resetData: function() {
      if (window.DEFAULT_CANDIDATES && Array.isArray(window.DEFAULT_CANDIDATES)) {
        AppState.candidates = JSON.parse(JSON.stringify(window.DEFAULT_CANDIDATES));
        localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.candidates));
        
        // If JSON server is connected, sync them sequentially or warn
        if (AppState.apiMode === 'JSON_SERVER') {
          showToast('Local state reset. Syncing with db.json...', 'info');
        }
        return Promise.resolve(AppState.candidates);
      }
      return Promise.reject(new Error('Default dataset not found'));
    }
  };

  // ==========================================================================
  // Card HTML Template & Board Renderer
  // ==========================================================================

  function getInitials(name) {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function createCardHtml(candidate) {
    const initials = getInitials(candidate.name);
    const avatarColor = candidate.avatarColor || '#6366f1';
    const scoreClass = getScoreClass(candidate.score || 75);
    
    // Skills tags (display first 3)
    const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
    const visibleSkills = skills.slice(0, 3);
    const extraSkillsCount = skills.length - 3;
    
    let skillsHtml = '';
    visibleSkills.forEach(s => {
      skillsHtml += `<span class="skill-tag">${escapeHtml(s)}</span>`;
    });
    if (extraSkillsCount > 0) {
      skillsHtml += `<span class="skill-tag-more">+${extraSkillsCount}</span>`;
    }

    return `
      <div class="candidate-card" data-id="${candidate.id}" data-name="${escapeHtml(candidate.name)}" data-role="${escapeHtml(candidate.role)}">
        <div class="card-header-row">
          <div class="candidate-identity">
            <div class="candidate-avatar" style="background-color: ${avatarColor};">
              ${initials}
            </div>
            <div class="candidate-meta-names">
              <div class="candidate-name" title="Click to view details">${escapeHtml(candidate.name)}</div>
              <div class="candidate-role">${escapeHtml(candidate.role)}</div>
            </div>
          </div>
          <div class="candidate-id-badge">#${candidate.id}</div>
        </div>

        <div class="card-details-row">
          <span><i class="fa-solid fa-briefcase"></i> ${escapeHtml(candidate.experience || '3+ yrs')}</span>
          <span class="score-pill ${scoreClass}">
            <i class="fa-solid fa-star"></i> ${candidate.score || 80}%
          </span>
        </div>

        <div class="skills-list">
          ${skillsHtml}
        </div>

        <div class="card-footer">
          <span class="card-footer-company"><i class="fa-regular fa-building"></i> ${escapeHtml(candidate.company || 'Tech Corp')}</span>
          <span class="card-drag-indicator"><i class="fa-solid fa-grip-vertical"></i></span>
        </div>
      </div>
    `;
  }

  function renderBoard() {
    // Clear all column cards
    $('.column-cards').empty();

    // Group candidates by stage
    AppState.candidates.forEach(candidate => {
      const stage = candidate.stage || 'applied';
      const $columnCards = $(`.column-cards[data-stage="${stage}"]`);
      if ($columnCards.length) {
        $columnCards.append(createCardHtml(candidate));
      }
    });

    // Update counters and badges
    updateColumnBadges();

    // Re-initialize sortable
    initSortable();

    // Apply any active search filter
    applySearchFilter(AppState.currentFilterQuery);
  }

  // ==========================================================================
  // jQuery UI Sortable Setup (Key Requirement 1, 2, 3)
  // ==========================================================================

  function initSortable() {
    // Destroy previous sortable instance if exists
    if ($('.column-cards').hasClass('ui-sortable')) {
      $('.column-cards').sortable('destroy');
    }

    $('.column-cards').sortable({
      connectWith: '.column-cards',
      placeholder: 'card-sortable-placeholder',
      revert: 200, // Smooth revert animation
      cursor: 'grabbing',
      tolerance: 'pointer',
      opacity: 0.88,
      items: '> .candidate-card',
      cancel: '.empty-column-message',
      
      start: function(event, ui) {
        // Record starting stage and index for undo and limit checks
        const $origColumn = ui.item.closest('.column');
        ui.item.data('prev-stage', $origColumn.data('stage'));
        ui.item.data('prev-index', ui.item.index());
        ui.item.addClass('is-dragging');
        
        // Highlight active columns
        $('.column').addClass('drag-active');
      },

      over: function(event, ui) {
        $(this).closest('.column').addClass('column-drag-over');
      },

      out: function(event, ui) {
        $(this).closest('.column').removeClass('column-drag-over');
      },

      stop: function(event, ui) {
        ui.item.removeClass('is-dragging');
        $('.column').removeClass('drag-active column-drag-over');
        updateColumnBadges();
      },

      // Key Requirement 2: On drop, use traversing $(this).closest('.column').data('stage')
      receive: function(event, ui) {
        const $targetContainer = $(this);
        const newStage = $targetContainer.closest('.column').data('stage');
        const prevStage = ui.item.data('prev-stage');
        const candidateId = Number(ui.item.data('id'));
        const prevIndex = ui.item.data('prev-index');

        const candidate = AppState.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        // Check WIP Limit: Interview column Max 10 candidates
        if (newStage === 'interview') {
          const currentInterviewCount = $targetContainer.children('.candidate-card').length;
          if (currentInterviewCount > AppState.wipLimits.interview) {
            // Cancel sortable movement smoothly
            $(ui.sender).sortable('cancel');
            
            showToast(`⚠️ WIP Limit Reached! Interview column cannot exceed 10 candidates. (Currently at limit)`, 'warning');
            
            // Visual shake on the Interview column
            const $interviewCol = $targetContainer.closest('.column');
            $interviewCol.addClass('shake-limit');
            setTimeout(() => $interviewCol.removeClass('shake-limit'), 600);
            
            updateColumnBadges();
            return;
          }
        }

        // Key Requirement 3: Trigger green pulse effect on successful card move
        ui.item.addClass('card-green-pulse');
        setTimeout(() => {
          ui.item.removeClass('card-green-pulse');
        }, 1300);

        // Key Requirement 2: Trigger AJAX PATCH /candidates/:id
        ApiClient.patchStage(candidateId, newStage, prevStage)
          .then(() => {
            console.log(`Candidate #${candidateId} stage patched to ${newStage}`);
          })
          .catch(err => {
            console.error('Failed to patch stage:', err);
          });

        // Key Requirement 4: Real-time toast with "Undo" button
        pushUndoAction({
          candidateId: candidateId,
          candidateName: candidate.name,
          prevStage: prevStage,
          newStage: newStage,
          prevIndex: prevIndex
        });

        // Update counters and badges immediately
        updateColumnBadges();
      }
    }).disableSelection();
  }

  // ==========================================================================
  // Real-Time Column Counters & WIP Badges (Key Requirement 4)
  // ==========================================================================

  function updateColumnBadges() {
    const stages = ['applied', 'screening', 'interview', 'hired', 'rejected'];
    let totalCards = 0;

    stages.forEach(stage => {
      const $col = $(`.column[data-stage="${stage}"]`);
      const $cards = $col.find('.column-cards .candidate-card');
      const totalCount = $cards.length;
      totalCards += totalCount;

      // Check if filter is active
      const visibleCount = $cards.filter(':visible').length;
      const isFiltered = AppState.currentFilterQuery.trim() !== '';

      const $badge = $col.find('.column-count-badge');
      if (isFiltered) {
        $badge.text(`${visibleCount}/${totalCount}`);
      } else {
        $badge.text(totalCount);
      }

      // Special WIP badge for Interview column
      if (stage === 'interview') {
        const $wipBadge = $('#interviewWipBadge');
        const limit = AppState.wipLimits.interview;
        $wipBadge.text(`${totalCount} / ${limit} WIP`);

        $wipBadge.removeClass('wip-warning wip-max');
        if (totalCount >= limit) {
          $wipBadge.addClass('wip-max').text(`${totalCount} / ${limit} FULL`);
        } else if (totalCount >= limit - 2) {
          $wipBadge.addClass('wip-warning');
        }
      }

      // Empty column message
      const $emptyMsg = $col.find('.empty-column-message');
      if (visibleCount === 0) {
        $emptyMsg.show();
      } else {
        $emptyMsg.hide();
      }
    });

    // Update header stats
    $('#statTotalCandidates').text(totalCards);
    $('#statInterviewCount').text($('.column[data-stage="interview"] .column-cards .candidate-card').length);
  }

  // ==========================================================================
  // Toast Notifications with "Undo" Action (Key Requirement 4)
  // ==========================================================================

  function showToast(message, type = 'info', undoAction = null) {
    const toastId = 'toast_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const iconClass = type === 'warning' ? 'fa-solid fa-triangle-exclamation' :
                      type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-bell';

    let undoBtnHtml = '';
    if (undoAction) {
      undoBtnHtml = `
        <button class="toast-undo-btn" data-toast-id="${toastId}">
          <i class="fa-solid fa-rotate-left"></i> Undo
        </button>
      `;
    }

    const toastHtml = `
      <div class="toast toast-${type}" id="${toastId}">
        <div class="toast-icon"><i class="${iconClass}"></i></div>
        <div class="toast-content">${message}</div>
        ${undoBtnHtml}
        <button class="toast-close-btn" onclick="$('#${toastId}').remove()">&times;</button>
        <div class="toast-progress" style="animation-duration: 6500ms;"></div>
      </div>
    `;

    const $toast = $(toastHtml).appendTo('#toastContainer');

    // Attach undo click handler
    if (undoAction) {
      $toast.find('.toast-undo-btn').on('click', function() {
        performUndo(undoAction, toastId);
      });
    }

    // Auto dismiss after 6.5s
    setTimeout(() => {
      $toast.addClass('toast-fade-out');
      setTimeout(() => $toast.remove(), 300);
    }, 6500);
  }

  function pushUndoAction(action) {
    AppState.undoStack.push(action);
    const msg = `Moved <strong>${escapeHtml(action.candidateName)}</strong> to <strong>${formatStage(action.newStage)}</strong>`;
    showToast(msg, 'success', action);
  }

  function performUndo(action, toastId) {
    // Remove the toast
    if (toastId) $(`#${toastId}`).remove();

    const candidate = AppState.candidates.find(c => c.id === action.candidateId);
    if (!candidate) return;

    const $card = $(`.candidate-card[data-id="${action.candidateId}"]`);
    const $prevColumnCards = $(`.column[data-stage="${action.prevStage}"] .column-cards`);

    if ($card.length && $prevColumnCards.length) {
      // Revert card in DOM
      if (typeof action.prevIndex === 'number' && action.prevIndex >= 0) {
        const $targetChild = $prevColumnCards.children('.candidate-card').eq(action.prevIndex);
        if ($targetChild.length && $targetChild[0] !== $card[0]) {
          $card.insertBefore($targetChild);
        } else {
          $prevColumnCards.append($card);
        }
      } else {
        $prevColumnCards.append($card);
      }

      // Add revert pulse
      $card.addClass('card-green-pulse');
      setTimeout(() => $card.removeClass('card-green-pulse'), 1200);

      // Trigger PATCH back to original stage
      ApiClient.patchStage(action.candidateId, action.prevStage, action.newStage, 'Action undone by recruiter')
        .then(() => {
          showToast(`Reverted <strong>${escapeHtml(action.candidateName)}</strong> back to <strong>${formatStage(action.prevStage)}</strong>`, 'info');
        });

      updateColumnBadges();
    }
  }

  // ==========================================================================
  // Candidate Details Modal (Key Requirement 5)
  // ==========================================================================

  function openCandidateModal(candidateId) {
    const candidate = AppState.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    AppState.selectedCandidateId = candidateId;

    const $modal = $('#candidateModal');
    const initials = getInitials(candidate.name);
    const avatarColor = candidate.avatarColor || '#6366f1';
    const scoreClass = getScoreClass(candidate.score || 80);

    // Modal Header
    $('#modalCandidateAvatar').css('background-color', avatarColor).text(initials);
    $('#modalCandidateName').text(candidate.name);
    $('#modalCandidateId').text('#' + candidate.id);
    $('#modalCandidateRole').text(candidate.role);
    
    // Details Grid
    $('#modalEmail').attr('href', 'mailto:' + candidate.email).text(candidate.email || 'N/A');
    $('#modalPhone').attr('href', 'tel:' + candidate.phone).text(candidate.phone || 'N/A');
    $('#modalLocation').text(candidate.location || 'Remote / Hybrid');
    $('#modalExperience').text(candidate.experience || 'Not specified');
    $('#modalCompany').text(candidate.company || 'Independent');
    $('#modalExpectedSalary').text(candidate.expectedSalary || 'Competitive');
    $('#modalNoticePeriod').text(candidate.noticePeriod || 'Standard');

    // Score breakdown
    const breakdown = candidate.scoreBreakdown || {
      technical: Math.min(100, (candidate.score || 80) + 2),
      architecture: Math.min(100, (candidate.score || 80) - 2),
      communication: Math.min(100, (candidate.score || 80) + 1)
    };
    $('#modalOverallScore').html(`<span class="score-pill ${scoreClass}"><i class="fa-solid fa-star"></i> Overall Score: ${candidate.score || 80}%</span>`);
    $('#scoreBarTechnical').css('width', breakdown.technical + '%');
    $('#scoreValTechnical').text(breakdown.technical + '%');
    $('#scoreBarArchitecture').css('width', breakdown.architecture + '%');
    $('#scoreValArchitecture').text(breakdown.architecture + '%');
    $('#scoreBarCommunication').css('width', breakdown.communication + '%');
    $('#scoreValCommunication').text(breakdown.communication + '%');

    // Skills chips
    const $skillsContainer = $('#modalSkillsContainer').empty();
    const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
    skills.forEach(s => {
      $skillsContainer.append(`<span class="skill-tag">${escapeHtml(s)}</span>`);
    });

    // Notes
    $('#modalEvaluationSummary').text(candidate.notes || 'No evaluation notes recorded yet.');

    // Interactive Stage Buttons
    $('.btn-stage-switch').removeClass('active');
    $(`.btn-stage-switch[data-stage="${candidate.stage}"]`).addClass('active');

    // Render Timeline
    renderModalTimeline(candidate.timeline || []);

    // Show Modal
    $modal.addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function renderModalTimeline(timeline) {
    const $list = $('#modalTimelineList').empty();
    if (!timeline || timeline.length === 0) {
      $list.append('<p style="color: var(--text-muted); font-size: 0.85rem;">No timeline activities logged.</p>');
      return;
    }

    timeline.forEach(item => {
      const timeStr = formatDate(item.timestamp);
      const html = `
        <div class="timeline-entry">
          <div class="timeline-dot"></div>
          <div class="timeline-header">
            <span class="timeline-action">${escapeHtml(item.action)}</span>
            <span class="timeline-time">${timeStr}</span>
          </div>
          <div class="timeline-actor" style="font-size: 0.72rem; color: var(--text-muted);">By: ${escapeHtml(item.actor || 'System')}</div>
          ${item.note ? `<div class="timeline-note">${escapeHtml(item.note)}</div>` : ''}
        </div>
      `;
      $list.append(html);
    });
  }

  function closeModal() {
    $('#candidateModal').removeClass('open');
    $('body').css('overflow', '');
    AppState.selectedCandidateId = null;
    $('#newNoteInput').val('');
  }

  // ==========================================================================
  // Real-Time Search Bar Filter (Key Requirement 6)
  // ==========================================================================

  function applySearchFilter(query) {
    AppState.currentFilterQuery = query;
    const cleanQuery = (query || '').trim().toLowerCase();
    const $clearBtn = $('#searchClearBtn');
    const $feedback = $('#searchMatchesFeedback');

    if (cleanQuery.length > 0) {
      $clearBtn.show();
    } else {
      $clearBtn.hide();
      $feedback.hide();
    }

    let matchCount = 0;
    const totalCount = AppState.candidates.length;

    $('.candidate-card').each(function() {
      const $card = $(this);
      const name = ($card.data('name') || '').toLowerCase();
      const role = ($card.data('role') || '').toLowerCase();
      const id = String($card.data('id') || '');

      const isMatch = !cleanQuery || 
                      name.includes(cleanQuery) || 
                      role.includes(cleanQuery) ||
                      id.includes(cleanQuery);

      if (isMatch) {
        $card.show();
        matchCount++;

        // Highlight matching text in name and role
        if (cleanQuery) {
          highlightCardText($card, cleanQuery);
        } else {
          removeHighlight($card);
        }
      } else {
        $card.hide();
        removeHighlight($card);
      }
    });

    if (cleanQuery) {
      $feedback.show().html(`<i class="fa-solid fa-magnifying-glass"></i> Showing <strong>${matchCount}</strong> of ${totalCount} candidates`);
    }

    updateColumnBadges();
  }

  function highlightCardText($card, query) {
    const $name = $card.find('.candidate-name');
    const $role = $card.find('.candidate-role');
    const origName = $card.data('name');
    const origRole = $card.data('role');

    $name.html(highlightSubstr(origName, query));
    $role.html(highlightSubstr(origRole, query));
  }

  function removeHighlight($card) {
    $card.find('.candidate-name').text($card.data('name'));
    $card.find('.candidate-role').text($card.data('role'));
  }

  function highlightSubstr(str, query) {
    if (!str || !query) return escapeHtml(str);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(str).replace(regex, '<mark class="highlight-match">$1</mark>');
  }

  // ==========================================================================
  // Mobile Responsive 390px Viewport Navigation (Key Requirement 7)
  // ==========================================================================

  function initMobileNav() {
    $('.mobile-nav-btn').on('click', function() {
      const stage = $(this).data('stage');
      $('.mobile-nav-btn').removeClass('active');
      $(this).addClass('active');

      if (stage === 'all') {
        $('.kanban-board').animate({ scrollLeft: 0 }, 300);
      } else {
        const $targetCol = $(`.column[data-stage="${stage}"]`);
        if ($targetCol.length) {
          const boardOffset = $('.kanban-board').scrollLeft();
          const colOffset = $targetCol.position().left;
          $('.kanban-board').animate({ scrollLeft: boardOffset + colOffset - 16 }, 300);
        }
      }
    });

    // Update active mobile nav pill on scroll
    let scrollTimeout;
    $('.kanban-board').on('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = $(this).scrollLeft();
        const colWidth = 320;
        const colIndex = Math.round(scrollLeft / colWidth);
        const stages = ['applied', 'screening', 'interview', 'hired', 'rejected'];
        if (colIndex >= 0 && colIndex < stages.length) {
          $('.mobile-nav-btn').removeClass('active');
          $(`.mobile-nav-btn[data-stage="${stages[colIndex]}"]`).addClass('active');
        }
      }, 100);
    });
  }

  // ==========================================================================
  // Event Bindings
  // ==========================================================================

  function bindEvents() {
    // Real-Time Search Bar
    $('#searchInput').on('input', function() {
      applySearchFilter($(this).val());
    });

    $('#searchClearBtn').on('click', function() {
      $('#searchInput').val('').focus();
      applySearchFilter('');
    });

    // Candidate Card Click (Delegated)
    $(document).on('click', '.candidate-card', function(e) {
      // Avoid opening modal if dragging or clicking buttons inside
      if ($(this).hasClass('is-dragging')) return;
      const candidateId = Number($(this).data('id'));
      openCandidateModal(candidateId);
    });

    // Modal Close
    $('#modalCloseBtn, .modal-backdrop').on('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    $(document).on('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Modal Stage Switcher Buttons
    $('.btn-stage-switch').on('click', function() {
      if (!AppState.selectedCandidateId) return;
      const newStage = $(this).data('stage');
      const candidate = AppState.candidates.find(c => c.id === AppState.selectedCandidateId);
      if (!candidate || candidate.stage === newStage) return;

      // Check WIP Limit if moving to interview
      if (newStage === 'interview') {
        const count = $(`.column[data-stage="interview"] .column-cards .candidate-card`).length;
        if (count >= AppState.wipLimits.interview) {
          showToast(`⚠️ WIP Limit Reached! Interview column cannot exceed 10 candidates.`, 'warning');
          return;
        }
      }

      const prevStage = candidate.stage;
      ApiClient.patchStage(candidate.id, newStage, prevStage, 'Stage updated via candidate modal');

      // Update button active state
      $('.btn-stage-switch').removeClass('active');
      $(this).addClass('active');

      // Re-render board and refresh modal timeline
      renderBoard();
      renderModalTimeline(candidate.timeline);

      // Trigger green pulse on the card
      const $card = $(`.candidate-card[data-id="${candidate.id}"]`);
      $card.addClass('card-green-pulse');
      setTimeout(() => $card.removeClass('card-green-pulse'), 1200);

      showToast(`Promoted <strong>${escapeHtml(candidate.name)}</strong> to <strong>${formatStage(newStage)}</strong>`, 'success');
    });

    // Add Note Form in Modal
    $('#btnAddNote').on('click', function() {
      const noteText = $('#newNoteInput').val().trim();
      if (!noteText || !AppState.selectedCandidateId) return;

      ApiClient.addNote(AppState.selectedCandidateId, noteText)
        .then(candidate => {
          $('#newNoteInput').val('');
          renderModalTimeline(candidate.timeline);
          showToast('Assessment note recorded successfully', 'info');
        });
    });

    $('#newNoteInput').on('keydown', function(e) {
      if (e.key === 'Enter') {
        $('#btnAddNote').trigger('click');
      }
    });

    // Server Status Click: Re-probe connection
    $('#serverStatusBadge').on('click', function() {
      showToast('Checking JSON Server connection on port 3000...', 'info');
      ApiClient.checkConnection().then(isOnline => {
        if (isOnline) {
          showToast('🟢 Connected to JSON Server! Syncing data...', 'success');
          ApiClient.fetchCandidates().then(() => renderBoard());
        } else {
          showToast('🟡 JSON Server not detected. Staying in LocalStorage mode.', 'warning');
        }
      });
    });

    // Reset Data Button
    $('#btnResetData').on('click', function() {
      if (confirm('Reset candidates dataset back to default 50 candidates (including Priya Sharma #201)?')) {
        ApiClient.resetData().then(() => {
          renderBoard();
          showToast('Reset back to 50 initial mock candidates.', 'info');
        });
      }
    });

    // New Candidate Modal Trigger
    $('#btnNewCandidate').on('click', function() {
      const name = prompt('Enter candidate full name:');
      if (!name || !name.trim()) return;
      const role = prompt('Enter candidate role / title:', 'Full Stack Engineer');
      if (!role) return;

      const newId = 300 + Math.floor(Math.random() * 900);
      const newCandidate = {
        id: newId,
        name: name.trim(),
        role: role.trim(),
        stage: 'applied',
        score: Math.floor(Math.random() * 20) + 78,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
        location: 'Bangalore, India',
        experience: '4+ Years',
        company: 'Technology Partner',
        expectedSalary: '$110,000 / ₹22 LPA',
        noticePeriod: '30 Days',
        avatarColor: '#3b82f6',
        skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
        scoreBreakdown: { technical: 85, architecture: 82, communication: 84 },
        timeline: [
          {
            action: 'Application Created',
            stage: 'applied',
            timestamp: new Date().toISOString(),
            actor: 'Talent Acquisition',
            note: 'Candidate entered into pipeline.'
          }
        ],
        notes: 'Newly registered candidate.'
      };

      AppState.candidates.unshift(newCandidate);
      localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.candidates));

      if (AppState.apiMode === 'JSON_SERVER') {
        $.ajax({
          url: AppState.apiBaseUrl,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(newCandidate)
        });
      }

      renderBoard();
      showToast(`Added candidate <strong>${escapeHtml(newCandidate.name)}</strong> to Applied`, 'success');
    });
  }

  // ==========================================================================
  // Initialization Lifecycle
  // ==========================================================================

  $(document).ready(function() {
    console.log('Initializing Recruitment Kanban Board [BHATIA-T1]...');

    initMobileNav();
    bindEvents();

    // Check server status then load candidates
    ApiClient.checkConnection().finally(() => {
      ApiClient.fetchCandidates().then(() => {
        renderBoard();
        console.log(`Loaded ${AppState.candidates.length} candidates. Mode: ${AppState.apiMode}`);
      });
    });
  });

})(jQuery);
