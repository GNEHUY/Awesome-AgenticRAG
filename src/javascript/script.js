// DOM Elements
const papersContainer = document.getElementById('papers-container');
const paperCount = document.getElementById('paper-count');
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');
const statsDashboard = document.getElementById('stats-dashboard');
const tagFilters = document.getElementById('tag-filters');
const topicGrid = document.getElementById('topic-grid');
const latestPapers = document.getElementById('latest-papers');
const activeFiltersEl = document.getElementById('active-filters');
const heroPanel = document.getElementById('hero-panel');

// State
let activeYearFilter = 'all';
let activeSearchQuery = '';
let activeTags = [];
let intersectionObserver = null;

const topicGuides = [
    {
        title: 'RL-trained Search Agents',
        description: 'Agents that learn when and how to search through outcome, process, or hybrid rewards.',
        tags: ['RL-based', 'Search Agent'],
        accent: 'method'
    },
    {
        title: 'Process Rewards & Credit Assignment',
        description: 'Dense supervision, step-wise rewards, pivots, and process-level feedback for long search trajectories.',
        tags: ['Process Reward', 'RL-based'],
        accent: 'method'
    },
    {
        title: 'Deep Research Systems',
        description: 'Long-horizon browsing, report generation, evidence gathering, and research-agent workflows.',
        tags: ['Deep Research', 'Agent'],
        accent: 'task'
    },
    {
        title: 'Self-play & Self-evolving Agents',
        description: 'Agents that bootstrap tasks, trajectories, or preferences from their own search interactions.',
        tags: ['Self-Play', 'Agent'],
        accent: 'method'
    },
    {
        title: 'Benchmarks & Datasets',
        description: 'Evaluation suites and datasets for measuring search, multi-hop reasoning, and deep research ability.',
        tags: ['Benchmark', 'Dataset'],
        accent: 'task'
    },
    {
        title: 'Efficiency & Memory',
        description: 'Token-efficient, training-free, memory, and context-management methods for scalable search.',
        tags: ['Token-Efficient', 'Memory', 'Training-free'],
        accent: 'feature'
    }
];

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
    renderHeroPanel();
    renderStats();
    renderYearNav();
    renderTopicGuides();
    renderLatestPapers();
    renderTagFilters();
    renderPapers();
    setupEventListeners();
    initScrollAnimation();
});

// === Hero Panel ===
function renderHeroPanel() {
    const sorted = getPapersSortedByDate(papers);
    const latest = sorted[0];
    const topTags = getTopTags(4);

    heroPanel.innerHTML = `
        <div class="hero-panel-label">Latest paper</div>
        <a class="hero-latest-title" href="${latest.url}" target="_blank" rel="noopener noreferrer">${escapeHtmlWithSup(latest.name)}</a>
        <p>${escapeHtmlWithSup(trimText(latest.description, 128))}</p>
        <div class="hero-meta">
            <span>${latest.date}</span>
            <span>${papers.length} papers</span>
        </div>
        <div class="hero-topics">
            ${topTags.map(([tag, count]) => `<button class="hero-topic" type="button" data-topic-tag="${escapeAttribute(tag)}">${escapeHtml(tag)} - ${count}</button>`).join('')}
        </div>
    `;
}

// === Stats Dashboard ===
function renderStats() {
    const total = papers.length;
    const hasCode = papers.filter(p => p.codeLinks.length > 0).length;
    const hasDataset = papers.filter(p => p.datasetLinks.length > 0).length;

    const allYears = papers.map(p => p.year);
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);

    statsDashboard.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${total}</div>
            <div class="stat-label">Papers</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${hasCode}</div>
            <div class="stat-label">Open Code</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${hasDataset}</div>
            <div class="stat-label">Datasets</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${minYear}-${maxYear}</div>
            <div class="stat-label">Year Span</div>
        </div>
    `;
}

// === Year Navigation ===
function renderYearNav() {
    const years = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
    const placeholder = document.getElementById('year-nav-placeholder');
    placeholder.innerHTML = years.map(y =>
        `<a href="#" class="nav-link" data-filter="${y}">${y}</a>`
    ).join('');
}

// === Topic Guides ===
function renderTopicGuides() {
    topicGrid.innerHTML = topicGuides.map(topic => {
        const count = countPapersForTags(topic.tags);
        const chips = topic.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
        return `
            <article class="topic-card topic-${topic.accent}" data-topic-tags="${escapeAttribute(topic.tags.join('|'))}" tabindex="0">
                <div class="topic-card-topline">
                    <span class="topic-count">${count} papers</span>
                    <span class="topic-arrow">Explore</span>
                </div>
                <h3>${escapeHtml(topic.title)}</h3>
                <p>${escapeHtml(topic.description)}</p>
                <div class="topic-tags">${chips}</div>
            </article>
        `;
    }).join('');
}

// === Latest Papers ===
function renderLatestPapers() {
    latestPapers.innerHTML = getPapersSortedByDate(papers).slice(0, 6).map(paper => {
        const tags = paper.tags.slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
        return `
            <article class="latest-card">
                <div class="latest-date">${paper.date}</div>
                <h3><a href="${paper.url}" target="_blank" rel="noopener noreferrer">${escapeHtmlWithSup(paper.name)}</a></h3>
                <p>${escapeHtmlWithSup(trimText(paper.description, 116))}</p>
                <div class="latest-tags">${tags}</div>
            </article>
        `;
    }).join('');
}

// === Tag Filters ===
function renderTagFilters() {
    const tagCounts = {};
    papers.forEach(p => {
        p.tags.forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
    });

    let html = '';
    for (const [category, tagList] of Object.entries(tagCategories)) {
        const catLabel = category === 'methods' ? 'method' : category === 'tasks' ? 'task' : 'feature';
        html += `<span class="tag-section-label">${category}</span>`;
        tagList.forEach(tag => {
            const count = tagCounts[tag] || 0;
            html += `<button class="tag-chip" type="button" data-tag="${escapeAttribute(tag)}" data-cat="${catLabel}" aria-pressed="false">${escapeHtml(tag)} (${count})</button>`;
        });
    }
    tagFilters.innerHTML = html;

    tagFilters.querySelectorAll('.tag-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            toggleTag(chip.dataset.tag);
        });
    });
}

// === Get Filtered Papers ===
function getFilteredPapers() {
    let filtered = papers;

    if (activeYearFilter !== 'all') {
        filtered = filtered.filter(p => p.year === parseInt(activeYearFilter));
    }

    if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query)) ||
            String(p.year).includes(query)
        );
    }

    if (activeTags.length > 0) {
        filtered = filtered.filter(p =>
            activeTags.some(t => p.tags.includes(t))
        );
    }

    return filtered;
}

// === Render Papers ===
function renderPapers() {
    const filtered = getFilteredPapers();

    const grouped = {};
    filtered.forEach(paper => {
        const year = paper.year;
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(paper);
    });

    const years = Object.keys(grouped).sort((a, b) => b - a);

    if (years.length === 0) {
        papersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No papers found</h3>
                <p>Try another keyword, choose a broader topic, or clear the active filters.</p>
                <button type="button" class="clear-filters-btn" data-clear-filters>Clear filters</button>
            </div>
        `;
    } else {
        let html = '';
        years.forEach(year => {
            const papersOfYear = grouped[year];
            html += `
                <div class="year-group">
                    <div class="year-header">
                        <span class="year-label">${year}</span>
                        <span class="year-count">${papersOfYear.length} papers</span>
                        <div class="year-line"></div>
                    </div>`;

            const months = {};
            getPapersSortedByDate(papersOfYear).forEach(p => {
                if (!months[p.date]) months[p.date] = [];
                months[p.date].push(p);
            });

            Object.entries(months).forEach(([month, monthPapers]) => {
                const [y, m] = month.split('.');
                const monthName = formatDate(new Date(parseInt(y), parseInt(m) - 1));
                html += `<div class="month-header">${monthName}</div>`;
                monthPapers.forEach(paper => {
                    html += createPaperCard(paper);
                });
            });

            html += `</div>`;
        });
        papersContainer.innerHTML = html;
    }

    paperCount.textContent = `${filtered.length}${filtered.length !== papers.length ? ' / ' + papers.length : ''} papers`;
    searchCount.textContent = activeSearchQuery ? `${filtered.length} results` : '';
    renderActiveFilters();
    syncFilterControls();
    initScrollAnimation();
}

// === Create Paper Card HTML ===
function createPaperCard(paper) {
    const tagsHtml = paper.tags.length > 0 ? paper.tags.map(tag => {
        const cat = getTagCategory(tag);
        return `<span class="paper-tag tag-${cat}">${escapeHtml(tag)}</span>`;
    }).join('') : '<span class="paper-tag">Untagged</span>';

    const canExpand = paper.description.length > 150;
    const expandButtonHtml = canExpand
        ? '<button type="button" class="paper-expand-btn" aria-expanded="false">Show more</button>'
        : '';

    let linksHtml = `
        <a href="${paper.url}" class="paper-link-btn" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Paper
        </a>`;

    paper.codeLinks.forEach(link => {
        linksHtml += `
            <a href="${link}" class="paper-link-btn code-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                Code
            </a>`;
    });

    paper.datasetLinks.forEach(link => {
        const isHF = link.includes('huggingface');
        linksHtml += `
            <a href="${link}" class="paper-link-btn dataset-btn" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16"/>
                </svg>
                ${isHF ? 'HuggingFace' : 'Dataset'}
            </a>`;
    });

    const badges = [];
    if (paper.codeLinks.length > 0) badges.push('<span class="paper-badge">Code</span>');
    if (paper.datasetLinks.length > 0) badges.push('<span class="paper-badge dataset">Dataset</span>');

    return `
        <article class="paper-card">
            <div class="paper-header">
                <span class="paper-date">${paper.date}</span>
                <div class="paper-heading-main">
                    <h2 class="paper-title">
                        <a href="${paper.url}" target="_blank" rel="noopener noreferrer">${escapeHtmlWithSup(paper.name)}</a>
                    </h2>
                    <div class="paper-badges">${badges.join('')}</div>
                </div>
            </div>
            <p class="paper-abstract" data-expandable="${canExpand}">${escapeHtmlWithSup(paper.description)}</p>
            ${expandButtonHtml}
            <div class="paper-tags">${tagsHtml}</div>
            <div class="paper-links">${linksHtml}</div>
        </article>
    `;
}

// === Active Filters ===
function renderActiveFilters() {
    const chips = [];
    if (activeYearFilter !== 'all') {
        chips.push(`<button type="button" class="active-filter-chip" data-remove-year>Year: ${activeYearFilter} x</button>`);
    }
    if (activeSearchQuery) {
        chips.push(`<button type="button" class="active-filter-chip" data-clear-search>Search: ${escapeHtml(activeSearchQuery)} x</button>`);
    }
    activeTags.forEach(tag => {
        chips.push(`<button type="button" class="active-filter-chip" data-remove-tag="${escapeAttribute(tag)}">${escapeHtml(tag)} x</button>`);
    });

    if (chips.length === 0) {
        activeFiltersEl.innerHTML = '<span class="filter-hint">Select a topic, year, or tag to focus the map.</span>';
        return;
    }

    activeFiltersEl.innerHTML = `
        ${chips.join('')}
        <button type="button" class="clear-filters-btn" data-clear-filters>Clear all</button>
    `;
}

function syncFilterControls() {
    document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
        link.classList.toggle('active', link.dataset.filter === activeYearFilter);
    });
    document.querySelectorAll('.tag-chip').forEach(chip => {
        const active = activeTags.includes(chip.dataset.tag);
        chip.classList.toggle('active', active);
        chip.setAttribute('aria-pressed', String(active));
    });
}

function toggleTag(tag) {
    if (activeTags.includes(tag)) {
        activeTags = activeTags.filter(t => t !== tag);
    } else {
        activeTags.push(tag);
    }
    renderPapers();
}

function setTopicTags(tags) {
    activeTags = [...new Set(tags)];
    scrollToExplorer();
    renderPapers();
}

function clearFilters() {
    activeYearFilter = 'all';
    activeSearchQuery = '';
    activeTags = [];
    searchInput.value = '';
    renderPapers();
}

// === Event Listeners ===
function setupEventListeners() {
    document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.dataset.filter;
            if (filter === 'all' || /^\d{4}$/.test(filter)) {
                activeYearFilter = filter;
                renderPapers();
                scrollToExplorer();
            }
        });
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            activeSearchQuery = searchInput.value.trim();
            renderPapers();
        }, 200);
    });

    topicGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.topic-card');
        if (!card) return;
        setTopicTags(card.dataset.topicTags.split('|'));
    });

    topicGrid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.topic-card');
        if (!card) return;
        event.preventDefault();
        setTopicTags(card.dataset.topicTags.split('|'));
    });

    heroPanel.addEventListener('click', (event) => {
        const button = event.target.closest('[data-topic-tag]');
        if (!button) return;
        setTopicTags([button.dataset.topicTag]);
    });

    document.addEventListener('click', (event) => {
        const clearAll = event.target.closest('[data-clear-filters]');
        if (clearAll) {
            clearFilters();
            return;
        }

        const removeYear = event.target.closest('[data-remove-year]');
        if (removeYear) {
            activeYearFilter = 'all';
            renderPapers();
            return;
        }

        const clearSearch = event.target.closest('[data-clear-search]');
        if (clearSearch) {
            activeSearchQuery = '';
            searchInput.value = '';
            renderPapers();
            return;
        }

        const removeTag = event.target.closest('[data-remove-tag]');
        if (removeTag) {
            activeTags = activeTags.filter(tag => tag !== removeTag.dataset.removeTag);
            renderPapers();
        }
    });

    papersContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.paper-expand-btn');
        if (!button) return;
        togglePaperAbstract(button);
    });
}

function togglePaperAbstract(button) {
    const card = button.closest('.paper-card');
    const abstract = card.querySelector('.paper-abstract');
    const expanded = abstract.classList.toggle('expanded');
    button.textContent = expanded ? 'Show less' : 'Show more';
    button.setAttribute('aria-expanded', String(expanded));
}

// === Scroll Animation ===
function initScrollAnimation() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }

    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                intersectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.paper-card:not(.visible)').forEach(card => {
        intersectionObserver.observe(card);
    });
}

// === Helpers ===
function getTagCategory(tag) {
    if (tagCategories.methods.includes(tag)) return 'method';
    if (tagCategories.tasks.includes(tag)) return 'task';
    if (tagCategories.features.includes(tag)) return 'feature';
    return 'method';
}

function formatDate(date) {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getPapersSortedByDate(list) {
    return [...list].sort((a, b) => {
        const byDate = parseFloat(b.date) - parseFloat(a.date);
        if (byDate !== 0) return byDate;
        return b.id - a.id;
    });
}

function countPapersForTags(tags) {
    return papers.filter(paper => tags.some(tag => paper.tags.includes(tag))).length;
}

function getTopTags(limit) {
    const tagCounts = {};
    papers.forEach(paper => {
        paper.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function trimText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
}

function scrollToExplorer() {
    document.getElementById('papers').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeHtmlWithSup(value) {
    return escapeHtml(value).replace(/&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>');
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
}
