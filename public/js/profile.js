const ProfileTabs = {
    switchTab: (targetTabId, btnElement) => {
        const tabs = document.querySelectorAll('.profile-tab-content');
        tabs.forEach(tab => tab.classList.add('hidden'));

        const targetTab = document.getElementById(targetTabId);
        targetTab.classList.remove('hidden');

        targetTab.style.opacity = '0';
        setTimeout(() => targetTab.style.opacity = '1', 50);

        const navBtns = document.querySelectorAll('.profile-nav-btn');
        navBtns.forEach(btn => {
            btn.classList.remove('text-primary', 'border-primary', 'font-bold');
            btn.classList.add('text-gray-400', 'border-transparent');
        });

        btnElement.classList.remove('text-gray-400', 'border-transparent');
        btnElement.classList.add('text-primary', 'border-primary', 'font-bold');
    }
};