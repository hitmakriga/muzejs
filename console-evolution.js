document.addEventListener('DOMContentLoaded', function() {
    // Konsoles salikšanas simulators
    const components = document.querySelectorAll('.component');
    const dropZone = document.getElementById('drop-zone');
    const componentsPlaced = document.getElementById('components-placed');
    const consoleStats = document.getElementById('console-stats');
    const resetButton = document.getElementById('reset-build');
    const generationButtons = document.querySelectorAll('.gen-btn');
    const generationInfo = document.getElementById('generation-info');
    
    // Paaudžu informācija
    const generationData = {
        '1980': {
            title: '80. gadu konsoles',
            description: '8-bitu procesori, līdz 64KB RAM, kasetes vai disketes, vienkārša grafika.',
            components: ['cpu', 'ram', 'storage']
        },
        '1990': {
            title: '90. gadu konsoles',
            description: '16/32-bitu procesori, 1-4MB RAM, CD-ROM, 2D/3D grafika, stereo audio.',
            components: ['cpu', 'gpu', 'ram', 'storage', 'optical']
        },
        '2000': {
            title: '2000. gadu konsoles',
            description: '32/64-bitu procesori, 32-512MB RAM, DVD/Blu-ray, online multiplayer, HD grafika.',
            components: ['cpu', 'gpu', 'ram', 'storage', 'optical', 'cooling']
        },
        '2010': {
            title: '2010. gadu konsoles',
            description: 'Multi-core procesori, 4-8GB RAM, digitālais saturs, sociālie tīkli, 1080p grafika.',
            components: ['cpu', 'gpu', 'ram', 'storage', 'optical', 'cooling']
        },
        '2020': {
            title: 'Mūsdienu konsoles',
            description: '8-core procesori, 16GB+ RAM, SSD, 4K/8K grafika, ray tracing, cloud gaming.',
            components: ['cpu', 'gpu', 'ram', 'storage', 'optical', 'cooling']
        }
    };
    
    // Komponentu dati
    const componentDetails = {
        'cpu': {
            name: 'Processors',
            icon: 'fas fa-microchip',
            specs: {
                '1980': '8-bit, 1-3 MHz',
                '1990': '16-32 bit, 10-30 MHz',
                '2000': '32-64 bit, 200-700 MHz',
                '2010': 'Multi-core, 1-2 GHz',
                '2020': '8-core, 3-4 GHz'
            }
        },
        'gpu': {
            name: 'Grafikas process',
            icon: 'fas fa-project-diagram',
            specs: {
                '1980': 'Integrēts ar CPU',
                '1990': '2D/3D paātrinātājs',
                '2000': 'Dedicated GPU, 50-200 MHz',
                '2010': 'Unified shaders, 500-800 MHz',
                '2020': 'Ray tracing, 1-2 GHz'
            }
        },
        'ram': {
            name: 'Atmiņa (RAM)',
            icon: 'fas fa-memory',
            specs: {
                '1980': '1-64 KB',
                '1990': '1-4 MB',
                '2000': '32-512 MB',
                '2010': '4-8 GB',
                '2020': '16+ GB GDDR6'
            }
        },
        'storage': {
            name: 'Glabāšanas ierīce',
            icon: 'fas fa-hdd',
            specs: {
                '1980': 'Kasetes (tape)',
                '1990': 'Disketes, kartridži',
                '2000': 'HDD, 20-120 GB',
                '2010': 'HDD, 250-500 GB',
                '2020': 'SSD/NVMe, 500 GB-2 TB'
            }
        },
        'optical': {
            name: 'Optiskais disks',
            icon: 'fas fa-compact-disc',
            specs: {
                '1980': 'Nav',
                '1990': 'CD-ROM, 650 MB',
                '2000': 'DVD, 4.7-9 GB',
                '2010': 'Blu-ray, 25-50 GB',
                '2020': '4K Blu-ray, 100 GB'
            }
        },
        'cooling': {
            name: 'Dzesēšanas sistēma',
            icon: 'fas fa-wind',
            specs: {
                '1980': 'Pasīvā dzesēšana',
                '1990': 'Ventilators',
                '2000': 'Aktīvā dzesēšana',
                '2010': 'Heat pipes, vents',
                '2020': 'Liquid cooling, vapor chamber'
            }
        }
    };
    
    // Pašreizējā paaudze
    let currentGeneration = '1980';
    let placedComponents = [];
    
    // Inicializācija
    function init() {
        setupDragAndDrop();
        setupGenerationButtons();
        setupResetButton();
        updateGenerationInfo('1980');
    }
    
    // Iestata velkšanas un nomešanas funkcionalitāti
    function setupDragAndDrop() {
        // Velkšanas sākšana
        components.forEach(component => {
            component.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.dataset.component);
                this.classList.add('dragging');
            });
            
            component.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });
        
        // Nomešanas zona
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const componentId = e.dataTransfer.getData('text/plain');
            addComponentToConsole(componentId);
        });
    }
    
    // Pievieno komponentu konsolei
    function addComponentToConsole(componentId) {
        // Pārbauda, vai komponents jau nav pievienots
        if (placedComponents.includes(componentId)) {
            showMessage('Šis komponents jau ir pievienots konsoles korpusam!', 'warning');
            return;
        }
        
        // Pārbauda, vai komponents ir pieejams pašreizējā paaudzē
        if (!generationData[currentGeneration].components.includes(componentId)) {
            showMessage(`Šis komponents nebija pieejams ${currentGeneration}. gados!`, 'warning');
            return;
        }
        
        // Pievieno komponentu
        placedComponents.push(componentId);
        renderPlacedComponents();
        updateConsoleStats();
        showMessage(`${componentDetails[componentId].name} pievienots konsoles korpusam!`, 'success');
    }
    
    // Attēlo pievienotos komponentus
    function renderPlacedComponents() {
        componentsPlaced.innerHTML = '';
        
        if (placedComponents.length === 0) {
            componentsPlaced.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-arrow-left"></i>
                    <p>Velciet komponentus šeit, lai saliktu konsoli</p>
                </div>
            `;
            return;
        }
        
        placedComponents.forEach(componentId => {
            const component = componentDetails[componentId];
            const componentElement = document.createElement('div');
            componentElement.className = 'component-placed';
            componentElement.dataset.component = componentId;
            
            componentElement.innerHTML = `
                <i class="${component.icon}"></i>
                <span>${component.name}</span>
                <button class="remove-btn" data-component="${componentId}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            componentsPlaced.appendChild(componentElement);
            
            // Pievieno notikumu dzēšanas pogai
            const removeBtn = componentElement.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                const compId = this.dataset.component;
                removeComponentFromConsole(compId);
            });
        });
    }
    
    // Noņem komponentu no konsoles
    function removeComponentFromConsole(componentId) {
        placedComponents = placedComponents.filter(id => id !== componentId);
        renderPlacedComponents();
        updateConsoleStats();
        showMessage(`${componentDetails[componentId].name} noņemts no konsoles korpusa.`, 'info');
    }
    
    // Atjauno konsoles statistiku
    function updateConsoleStats() {
        if (placedComponents.length === 0) {
            consoleStats.innerHTML = '<p>Vēl nav pievienoti komponenti</p>';
            return;
        }
        
        let statsHTML = '';
        
        placedComponents.forEach(componentId => {
            const component = componentDetails[componentId];
            const spec = component.specs[currentGeneration] || 'N/A';
            
            statsHTML += `
                <div class="stats-item">
                    <span>${component.name}:</span>
                    <strong>${spec}</strong>
                </div>
            `;
        });
        
        // Aprēķina kopējo jaudu
        const powerScore = calculatePowerScore();
        statsHTML += `
            <div class="stats-item">
                <span>Kopējā jauda:</span>
                <strong>${powerScore}/100</strong>
            </div>
        `;
        
        consoleStats.innerHTML = statsHTML;
    }
    
    // Aprēķina konsoles jaudas rādītāju
    function calculatePowerScore() {
        if (placedComponents.length === 0) return 0;
        
        let score = 0;
        const maxComponents = generationData[currentGeneration].components.length;
        
        // Punkti par katru komponentu
        score += (placedComponents.length / maxComponents) * 60;
        
        // Bonus punkti par visu komplektu
        if (placedComponents.length === maxComponents) {
            score += 40;
        }
        
        return Math.round(score);
    }
    
    // Iestata paaudžu pogas
    function setupGenerationButtons() {
        generationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Noņem aktīvo klasi no visām pogām
                generationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Pievieno aktīvo klasi nospiestajai pogai
                this.classList.add('active');
                
                // Atjauno pašreizējo paaudzi
                currentGeneration = this.dataset.gen;
                
                // Atjauno paaudzes informāciju
                updateGenerationInfo(currentGeneration);
                
                // Notīra pievienotos komponentus
                placedComponents = [];
                renderPlacedComponents();
                updateConsoleStats();
                
                showMessage(`Pārslēgts uz ${generationData[currentGeneration].title} paaudzi`, 'info');
            });
        });
    }
    
    // Atjauno paaudzes informāciju
    function updateGenerationInfo(generation) {
        const data = generationData[generation];
        generationInfo.innerHTML = `
            <p><strong>${data.title}</strong>: ${data.description}</p>
            <p><em>Pieejamie komponenti: ${data.components.map(comp => componentDetails[comp].name).join(', ')}</em></p>
        `;
    }
    
    // Iestata atiestatīšanas pogu
    function setupResetButton() {
        resetButton.addEventListener('click', function() {
            placedComponents = [];
            renderPlacedComponents();
            updateConsoleStats();
            showMessage('Konsoles salikšana atiestatīta!', 'info');
        });
    }
    
    // Parāda ziņojumu
    function showMessage(message, type = 'info') {
        // Izveido vai atjauno ziņojumu elementu
        let messageElement = document.querySelector('.simulator-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'simulator-message';
            document.querySelector('.console-simulator').prepend(messageElement);
        }
        
        // Iestata ziņojuma stilus atkarībā no tipa
        let backgroundColor = '#2c3e50';
        if (type === 'success') backgroundColor = '#27ae60';
        if (type === 'warning') backgroundColor = '#f39c12';
        if (type === 'info') backgroundColor = '#3498db';
        
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.style.backgroundColor = backgroundColor;
        messageElement.style.color = 'white';
        messageElement.style.padding = '12px 20px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.marginBottom = '15px';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
        
        // Paslēp ziņojumu pēc 3 sekundēm
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
    
    // Pievieno CSS stilus velkšanas efektam
    const style = document.createElement('style');
    style.textContent = `
        .drag-over {
            background-color: #e9f7fe !important;
            border-color: #4ecdc4 !important;
            border-style: solid !important;
        }
        
        .dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }
        
        .component-placed {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .simulator-message {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Sākuma inicializācija
    init();
});
