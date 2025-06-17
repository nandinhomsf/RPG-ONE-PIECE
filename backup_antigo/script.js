// script.js - Centraliza toda a lógica JS da ficha de RPG
// Funções globais para todas as abas

// --- Utilitários Gerais ---
function getFormData(form) {
    const data = {};
    if (!form) return data;
    const elements = form.querySelectorAll('input, textarea, select');
    elements.forEach(el => {
        if (el.type === 'checkbox') {
            data[el.name] = el.checked;
        } else {
            data[el.name] = el.value;
        }
    });
    // Tabela de armas (se existir)
    const armasTbody = document.getElementById('armas-tbody');
    if (armasTbody) {
        data.armas = [];
        armasTbody.querySelectorAll('tr').forEach(tr => {
            const arma = {
                nome: tr.querySelector('input[name="arma_nome"]')?.value || '',
                bonus: tr.querySelector('input[name="arma_bonus"]')?.value || '',
                dano: tr.querySelector('input[name="arma_dano"]')?.value || ''
            };
            if (arma.nome || arma.bonus || arma.dano) data.armas.push(arma);
        });
    }
    return data;
}

function setFormData(form, data) {
    if (!form || !data) return;
    const elements = form.querySelectorAll('input, textarea, select');
    elements.forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = !!data[el.name];
        } else if (data[el.name] !== undefined) {
            el.value = data[el.name];
        }
    });
    // Tabela de armas (se existir)
    const armasTbody = document.getElementById('armas-tbody');
    if (armasTbody && Array.isArray(data.armas)) {
        armasTbody.innerHTML = '';
        data.armas.forEach(arma => {
            adicionarLinhaArma(arma);
        });
        if (data.armas.length === 0) adicionarLinhaArma();
    }
}

// --- Sincronização com localStorage ---
function sincronizarFichaComLocalStorage(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    // Carregar dados salvos
    const ficha = JSON.parse(localStorage.getItem('fichaRPG') || '{}');
    setFormData(form, ficha);
    // Salvar ao alterar qualquer campo
    form.addEventListener('input', () => {
        const data = getFormData(form);
        localStorage.setItem('fichaRPG', JSON.stringify(data));
    });
}

// --- Salvar e Carregar JSON ---
function salvarFichaComoJSON(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const data = getFormData(form);
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fichaRPG.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    mostrarFeedback('Ficha salva como JSON!');
}

function carregarFichaDeJSON(formId, fileInput) {
    const form = document.getElementById(formId);
    if (!form || !fileInput.files.length) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            setFormData(form, data);
            localStorage.setItem('fichaRPG', JSON.stringify(data));
            mostrarFeedback('Ficha carregada com sucesso!');
        } catch (err) {
            mostrarFeedback('Erro ao carregar JSON!', true);
        }
    };
    reader.readAsText(fileInput.files[0]);
}

// --- Manipulação dinâmica de armas/poderes ---
function adicionarLinhaArma(arma = {nome:'', bonus:'', dano:''}) {
    const armasTbody = document.getElementById('armas-tbody');
    if (!armasTbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input name="arma_nome" type="text" class="form-control" value="${arma.nome}" /></td>
        <td><input name="arma_bonus" type="text" class="form-control" value="${arma.bonus}" /></td>
        <td><input name="arma_dano" type="text" class="form-control" value="${arma.dano}" /></td>
        <td><button type="button" class="btn btn-danger" onclick="removerLinhaArma(this)">Excluir</button></td>
    `;
    armasTbody.appendChild(tr);
}

function removerLinhaArma(btn) {
    const tr = btn.closest('tr');
    if (tr) tr.remove();
}

// --- Manipulação dinâmica de poderes ---
function adicionarLinhaPoder(poder = {nome: '', nivel: '', pa: ''}) {
    const poderesTbody = document.getElementById('poderes-tbody');
    if (!poderesTbody) return;
    if (poderesTbody.children.length >= 7) {
        mostrarFeedback('Máximo de 7 poderes!', true);
        return;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input name="poder_nome" type="text" class="form-control" value="${poder.nome}" /></td>
        <td><input name="poder_nivel" type="number" min="1" max="7" class="form-control" value="${poder.nivel || ''}" /></td>
        <td><input name="poder_pa" type="number" min="0" class="form-control" value="${poder.pa || ''}" /></td>
        <td><button type="button" class="btn btn-danger" onclick="removerLinhaPoder(this)">Excluir</button></td>
    `;
    poderesTbody.appendChild(tr);
}

function removerLinhaPoder(btn) {
    const tr = btn.closest('tr');
    if (tr) tr.remove();
}

// --- Feedback visual ---
function mostrarFeedback(msg, erro = false) {
    let div = document.getElementById('feedback-msg');
    if (!div) {
        div = document.createElement('div');
        div.id = 'feedback-msg';
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.right = '20px';
        div.style.zIndex = 9999;
        document.body.appendChild(div);
    }
    div.innerText = msg;
    div.className = erro ? 'alert alert-danger' : 'alert alert-success';
    setTimeout(() => { div.remove(); }, 2000);
}

// --- Inicialização automática por página ---
document.addEventListener('DOMContentLoaded', function() {
    // Detecta qual formulário está presente e sincroniza
    if (document.getElementById('ficha-rpg-form')) {
        sincronizarFichaComLocalStorage('ficha-rpg-form');
        // Botões de salvar/carregar
        const form = document.getElementById('ficha-rpg-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFichaComoJSON('ficha-rpg-form');
        });
        // Adiciona botão de carregar JSON
        adicionarBotaoCarregar('ficha-rpg-form');
    }
    if (document.getElementById('perfil-form')) {
        sincronizarFichaComLocalStorage('perfil-form');
        const form = document.getElementById('perfil-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFichaComoJSON('perfil-form');
        });
        adicionarBotaoCarregar('perfil-form');
    }
    if (document.getElementById('inventario-form')) {
        sincronizarFichaComLocalStorage('inventario-form');
        const form = document.getElementById('inventario-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFichaComoJSON('inventario-form');
        });
        adicionarBotaoCarregar('inventario-form');
    }
    if (document.getElementById('poderes-form')) {
        sincronizarFichaComLocalStorage('poderes-form');
        const form = document.getElementById('poderes-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFichaComoJSON('poderes-form');
        });
        adicionarBotaoCarregar('poderes-form');
    }
    if (document.getElementById('pericias-form')) {
        sincronizarFichaComLocalStorage('pericias-form');
        const form = document.getElementById('pericias-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFichaComoJSON('pericias-form');
        });
        adicionarBotaoCarregar('pericias-form');
    }
});

// Adiciona botão de carregar JSON dinamicamente
function adicionarBotaoCarregar(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    if (form.querySelector('.btn-carregar-json')) return; // já existe
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.style.display = 'none';
    input.addEventListener('change', function() {
        carregarFichaDeJSON(formId, input);
        input.value = '';
    });
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary btn-carregar-json ms-2';
    btn.innerText = 'Carregar Ficha';
    btn.onclick = () => input.click();
    // Adiciona ao final do formulário
    const footer = form.querySelector('.card-footer, .text-end, .mb-3.text-end');
    if (footer) {
        footer.appendChild(btn);
        footer.appendChild(input);
    } else {
        form.appendChild(btn);
        form.appendChild(input);
    }
}

// --- Ajuste para salvar/carregar poderes dinâmicos ---
(function ajustarPoderesNoForm() {
    const formId = 'poderes-form';
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById(formId);
        if (!form) return;
        // Carregar poderes do localStorage
        const ficha = JSON.parse(localStorage.getItem('fichaRPG') || '{}');
        if (Array.isArray(ficha.poderes)) {
            const poderesTbody = document.getElementById('poderes-tbody');
            if (poderesTbody) {
                poderesTbody.innerHTML = '';
                ficha.poderes.forEach(poder => adicionarLinhaPoder(poder));
            }
        } else if (document.getElementById('poderes-tbody') && document.getElementById('poderes-tbody').children.length === 0) {
            adicionarLinhaPoder();
        }
        // Salvar ao alterar qualquer campo dos poderes
        form.addEventListener('input', () => {
            const poderesTbody = document.getElementById('poderes-tbody');
            if (!poderesTbody) return;
            const poderes = [];
            poderesTbody.querySelectorAll('tr').forEach(tr => {
                const nome = tr.querySelector('input[name="poder_nome"]')?.value || '';
                const nivel = tr.querySelector('input[name="poder_nivel"]')?.value || '';
                const pa = tr.querySelector('input[name="poder_pa"]')?.value || '';
                if (nome) poderes.push({nome, nivel, pa});
            });
            // Atualiza localStorage mantendo outros dados
            const fichaAtual = JSON.parse(localStorage.getItem('fichaRPG') || '{}');
            fichaAtual.poderes = poderes;
            localStorage.setItem('fichaRPG', JSON.stringify(fichaAtual));
        });
    });
})();

// --- Ajuste para salvar/carregar JSON dos poderes ---
(function ajustarPoderesJSON() {
    const originalGetFormData = getFormData;
    window.getFormData = function(form) {
        const data = originalGetFormData(form);
        // Poderes dinâmicos
        const poderesTbody = document.getElementById('poderes-tbody');
        if (poderesTbody) {
            data.poderes = [];
            poderesTbody.querySelectorAll('tr').forEach(tr => {
                const nome = tr.querySelector('input[name="poder_nome"]')?.value || '';
                const nivel = tr.querySelector('input[name="poder_nivel"]')?.value || '';
                const pa = tr.querySelector('input[name="poder_pa"]')?.value || '';
                if (nome) data.poderes.push({nome, nivel, pa});
            });
        }
        return data;
    };
    const originalSetFormData = setFormData;
    window.setFormData = function(form, data) {
        originalSetFormData(form, data);
        // Poderes dinâmicos
        const poderesTbody = document.getElementById('poderes-tbody');
        if (poderesTbody && Array.isArray(data.poderes)) {
            poderesTbody.innerHTML = '';
            data.poderes.forEach(poder => adicionarLinhaPoder(poder));
            if (data.poderes.length === 0) adicionarLinhaPoder();
        }
    };
})();
