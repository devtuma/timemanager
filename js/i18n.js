// Internationalization (i18n) System
const translations = {
    pt: {
        // Landing Page
        'hero-title': 'Domine Seu Tempo, Domine Suas Apresentações',
        'hero-description': 'Timer Manager é o aplicativo definitivo para quem precisa fazer apresentações, reuniões ou palestras com controle total do tempo. Pare de se preocupar com o relógio e foque no que realmente importa: seu conteúdo e sua audiência.',
        'btn-login': 'Entrar',
        'btn-register': 'Criar Conta',
        'features-title': 'Funcionalidades Principais',
        'feature1-title': 'Estruture Seu Tempo',
        'feature1-desc': 'Divida sua apresentação em pontos cronometrados com duração exata.',
        'feature2-title': 'Guia por Voz',
        'feature2-desc': 'O app fala suas palavras-chave no momento certo, mantendo você no ritmo.',
        'feature3-title': 'Sincronização em Nuvem',
        'feature3-desc': 'Seus projetos salvos e sincronizados entre todos os seus dispositivos.',
        'feature4-title': 'Alertas Inteligentes',
        'feature4-desc': 'Notificações visuais e sonoras para manter você no controle.',
        'feature5-title': 'Progresso Visual',
        'feature5-desc': 'Barras de progresso coloridas mostram o andamento em tempo real.',
        'feature6-title': 'Exportar/Importar',
        'feature6-desc': 'Faça backup e compartilhe seus projetos facilmente.',
        'usecases-title': 'Ideal Para',
        'usecase1': 'Defesas de TCC e Teses',
        'usecase2': 'Reuniões Executivas',
        'usecase3': 'Palestras e Conferências',
        'usecase4': 'Workshops e Treinamentos',
        'usecase5': 'Apresentações de Pitch',
        'footer-rights': 'Todos os direitos reservados.',

        // Auth Pages
        'login-title': 'Bem-vindo de Volta',
        'register-title': 'Criar Nova Conta',
        'label-name': 'Nome',
        'label-email': 'Email',
        'label-password': 'Senha',
        'label-confirm-password': 'Confirmar Senha',
        'password-hint': 'Mínimo de 6 caracteres',
        'remember-me': 'Lembrar de mim',
        'no-account': 'Não tem uma conta?',
        'have-account': 'Já tem uma conta?',
        'btn-create-account': 'Criar Conta',
        'back-home': '← Voltar para Home',
        'demo-mode-text': 'Ou continue sem login (modo local)',
        'btn-demo': 'Modo Demo (Sem Login)',

        // App
        'btn-logout': 'Sair',
        'projects-title': 'Meus Projetos',
        'search-placeholder': 'Buscar projetos...',
        'btn-import': '📥 Importar',
        'btn-new-project': '+ Novo Projeto',
        'empty-title': 'Nenhum projeto ainda',
        'empty-description': 'Crie seu primeiro projeto para começar a dominar suas apresentações!',
        'btn-create-first': 'Criar Primeiro Projeto',
        'btn-back': 'Voltar',
        'edit-title': 'Editar Projeto',
        'btn-export': '📤 Exportar',
        'btn-save': '💾 Salvar',
        'label-project-name': 'Nome do Projeto',
        'project-name-placeholder': 'Ex: Defesa de TCC',
        'label-hours': 'Horas',
        'label-minutes': 'Minutos',
        'label-seconds': 'Segundos',
        'total-time': 'Tempo Total:',
        'allocated-time': 'Tempo Alocado:',
        'remaining-time': 'Não Definido:',
        'points-title': 'Pontos Cronometrados',
        'btn-add-point': '+ Adicionar Ponto',
        'keywords-title': 'Palavras-chave',
        'total-progress': 'Progresso Total:',
        'btn-prev': '⏮ Anterior',
        'btn-play': 'Iniciar',
        'btn-pause': 'Pausar',
        'btn-next': 'Próximo ⏭',
        'delete-confirm-title': 'Confirmar Exclusão',
        'delete-confirm-message': 'Tem certeza que deseja excluir este projeto?',
        'btn-cancel': 'Cancelar',
        'btn-delete': 'Excluir',
        'btn-edit': 'Editar',
        'btn-start': 'Iniciar',
        'point-placeholder': 'Título do ponto',
        'keywords-placeholder': 'Digite as palavras-chave (uma por linha)',
        'points-count': 'pontos',
    },
    en: {
        // Landing Page
        'hero-title': 'Master Your Time, Master Your Presentations',
        'hero-description': 'Timer Manager is the ultimate app for those who need to deliver presentations, meetings, or lectures with total time control. Stop worrying about the clock and focus on what really matters: your content and your audience.',
        'btn-login': 'Login',
        'btn-register': 'Sign Up',
        'features-title': 'Key Features',
        'feature1-title': 'Structure Your Time',
        'feature1-desc': 'Divide your presentation into timed points with exact duration.',
        'feature2-title': 'Voice Guide',
        'feature2-desc': 'The app speaks your keywords at the right time, keeping you on track.',
        'feature3-title': 'Cloud Sync',
        'feature3-desc': 'Your projects saved and synced across all your devices.',
        'feature4-title': 'Smart Alerts',
        'feature4-desc': 'Visual and audio notifications to keep you in control.',
        'feature5-title': 'Visual Progress',
        'feature5-desc': 'Colored progress bars show progress in real-time.',
        'feature6-title': 'Export/Import',
        'feature6-desc': 'Backup and share your projects easily.',
        'usecases-title': 'Perfect For',
        'usecase1': 'Thesis Defenses',
        'usecase2': 'Executive Meetings',
        'usecase3': 'Lectures and Conferences',
        'usecase4': 'Workshops and Training',
        'usecase5': 'Pitch Presentations',
        'footer-rights': 'All rights reserved.',

        // Auth Pages
        'login-title': 'Welcome Back',
        'register-title': 'Create New Account',
        'label-name': 'Name',
        'label-email': 'Email',
        'label-password': 'Password',
        'label-confirm-password': 'Confirm Password',
        'password-hint': 'Minimum 6 characters',
        'remember-me': 'Remember me',
        'no-account': "Don't have an account?",
        'have-account': 'Already have an account?',
        'btn-create-account': 'Create Account',
        'back-home': '← Back to Home',
        'demo-mode-text': 'Or continue without login (local mode)',
        'btn-demo': 'Demo Mode (No Login)',

        // App
        'btn-logout': 'Logout',
        'projects-title': 'My Projects',
        'search-placeholder': 'Search projects...',
        'btn-import': '📥 Import',
        'btn-new-project': '+ New Project',
        'empty-title': 'No projects yet',
        'empty-description': 'Create your first project to start mastering your presentations!',
        'btn-create-first': 'Create First Project',
        'btn-back': 'Back',
        'edit-title': 'Edit Project',
        'btn-export': '📤 Export',
        'btn-save': '💾 Save',
        'label-project-name': 'Project Name',
        'project-name-placeholder': 'e.g., Thesis Defense',
        'label-hours': 'Hours',
        'label-minutes': 'Minutes',
        'label-seconds': 'Seconds',
        'total-time': 'Total Time:',
        'allocated-time': 'Allocated Time:',
        'remaining-time': 'Undefined:',
        'points-title': 'Timed Points',
        'btn-add-point': '+ Add Point',
        'keywords-title': 'Keywords',
        'total-progress': 'Total Progress:',
        'btn-prev': '⏮ Previous',
        'btn-play': 'Start',
        'btn-pause': 'Pause',
        'btn-next': 'Next ⏭',
        'delete-confirm-title': 'Confirm Deletion',
        'delete-confirm-message': 'Are you sure you want to delete this project?',
        'btn-cancel': 'Cancel',
        'btn-delete': 'Delete',
        'btn-edit': 'Edit',
        'btn-start': 'Start',
        'point-placeholder': 'Point title',
        'keywords-placeholder': 'Enter keywords (one per line)',
        'points-count': 'points',
    }
};

function getLanguage() {
    return localStorage.getItem('language') || 'pt';
}

function translate(key) {
    const lang = getLanguage();
    return translations[lang][key] || key;
}

function initI18n() {
    const lang = getLanguage();
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translate(key);
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = translate(key);
    });
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
