// Security check: require API key to be present
if (!localStorage.getItem('apiKey')) {
    window.location.href = 'index.html';
}

// ─── DYNAMIC SIDEBAR LOADER ───
// Loads sidebar from sidebar-template.html and syncs across all pages
async function loadSidebar() {
    try {
        const response = await fetch('sidebar-template.html');
        const templateHtml = await response.text();
        
        // Get the sidebar placeholder
        const sidebarPlaceholder = document.getElementById('sidebar-container');
        if (!sidebarPlaceholder) return;
        
        // Insert the sidebar HTML
        sidebarPlaceholder.innerHTML = templateHtml;
        
        // Determine current page and set active link
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const pageMap = {
            'dashboard.html': 'home',
            'settings.html': 'settings',
            'account.html': 'account',
            'About me.html': 'about',
            '': 'home'
        };
        
        const activePage = pageMap[currentPage];
        if (activePage) {
            const activeLink = sidebarPlaceholder.querySelector(`.${activePage}`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Attach toggle button functionality
        attachToggleListener();
        
        // Attach logout functionality
        attachLogoutListener();
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

// ─── TOGGLE BUTTON FUNCTIONALITY ───
function attachToggleListener() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
}

// ─── LOGOUT FUNCTIONALITY ───
function attachLogoutListener() {
    const logoutLink = document.querySelector('.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            localStorage.removeItem('apiKey');
            localStorage.removeItem('currentUser');
            // proceed to href (link handles the redirect)
        });
    }
}

// Load sidebar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
    loadSidebar();
}
