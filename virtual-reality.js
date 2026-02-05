document.addEventListener('DOMContentLoaded', function() {
    // VR pielietojumu simulācija
    const components = document.querySelectorAll('.component');
    const dropZone = document.getElementById('drop-zone');
    const componentsPlaced = document.getElementById('components-placed');
    const consoleStats = document.getElementById('console-stats');
    const resetButton = document.getElementById('reset-build');
    const generationButtons = document.querySelectorAll('.gen-btn');
    const generationInfo = document.getElementById('generation-info');
    
    // Tehnoloģiju līmeņu informācija
    const generationData = {
        'basic': {
            title: 'Pamatlīmenis',
            description: '3DOF, vienkārša grafika, mobilās ierīces, ierobežota interaktivitāte.',
            components: ['gaming', 'education', 'tourism']
        },
        'advanced': {
            title: 'Uzlabots',
            description: '6DOF, vidējas kvalitātes grafika, standalone ierīces, labāka interaktivitāte.',
            components: ['gaming', 'education', 'tourism', 'architecture']
        },
        'professional': {
            title: 'Profesionāls',
            description: 'Augstas izšķirtspējas grafika, precīza izsekošana, PC-based sistēmas, sarežģītas simulācijas.',
            components: ['gaming', 'education', 'medicine', 'architecture', 'training']
        },
        'future': {
            title: 'Nākotnes tehnoloģijas',
            description: '8K+ izšķirtspēja, pilnīga roku izsekošana, haptiskās vestes, sociālā VR, bezgalīga staigāšana.',
            components: ['gaming', 'education', 'medicine', 'architecture', 'training', 'tourism']
        }
    };
    
    // Pielietojumu dati
    const componentDetails = {
        'gaming': {
            name: 'Spēles',
            icon: 'fas fa-gamepad',
            specs: {
                'basic': 'Vienkāršas spēles, 3DOF',
                'advanced': 'Dažādas žanru spēles, 6DOF',
                'professional': 'AAA spēles, multiplayer, moduļi',
                'future': 'Pilnībā imersīvas, sociālās spēles'
            }
        },
        'education': {
            name: 'Izglītība',
            icon: 'fas fa-graduation-cap',
            specs: {
                'basic': 'Vizuālie mācību materiāli',
                'advanced': 'Interaktīvi mācību procesi',
                'professional': 'Reālistiskas simulācijas',
                'future': 'Personalizēta mācīšanās ar AI'
            }
        },
        'medicine': {
            name: 'Medicīna',
            icon: 'fas fa-heartbeat',
            specs: {
                'basic': 'Anatomijas vizualizācija',
                'advanced': 'Procedūru demonstrācija',
                'professional': 'Ķirurģijas simulācijas',
                'future': 'Tālvadības operācijas'
            }
        },
        'architecture': {
            name: 'Arhitektūra',
            icon: 'fas fa-building',
            specs: {
                'basic': '3D modeļu apskate',
                'advanced': 'Iekštelpu vizualizācija',
                'professional': 'Pilna mēroga simulācijas',
                'future': 'Reāllaika kopīga projektēšana'
            }
        },
        'training': {
            name: 'Apmācība',
            icon: 'fas fa-user-graduate',
            specs: {
                'basic': 'Pamatprocedūru demonstrācija',
                'advanced': 'Interaktīvas apmācības',
                'professional': 'Reālistiskas situāciju simulācijas',
                'future': 'AI vadītas personalizētas apmācības'
            }
        },
        'tourism': {
            name: 'Tūrisms',
            icon: 'fas fa-plane',
            specs: {
                'basic': '360° video apskates',
                'advanced': 'Interaktīvas ekskursijas',
                'professional': 'Vēsturisko vietu rekonstrukcijas',
                'future': 'Multisensoru ceļojumu simulācijas'
            }
        }
    };
    
    // Pašreizējā tehnoloģiju līmenis
    let currentGeneration = 'basic';
    let placedComponents = [];
    
    // Inicializācija
    function init() {
        setupDragAndDrop();
        setupGenerationButtons();
        setupResetButton();
        updateGenerationInfo('basic');
    }
    
    // Iestata velkšanas un nomešanas funkcionalitāti
    function setupDragAndDrop() {
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
            addComponentToVR(componentId);
        });
    }
    
    // Pievieno pielietojumu VR pieredzei
    function addComponentToVR(componentId) {
        // Pārbauda, vai pielietojums jau nav pievienots
        if (placedComponents.includes(componentId)) {
            showMessage('Šis pielietojums jau ir pievienots VR pieredzei!', 'warning');
            return;
        }
        
        // Pārbauda, vai pielietojums ir pieejams pašreizējā līmenī
        if (!generationData[currentGeneration].components.includes(componentId)) {
            showMessage(`Šis pielietojums nav pieejams ${generationData[currentGeneration].title} līmenī!`, 'warning');
            return;
        }
        
        // Pievieno pielietojumu
        placedComponents.push(componentId);
        renderPlacedComponents();
        updateVRStats();
        showMessage(`${componentDetails[componentId].name} pievienots VR pieredzei!`, 'success');
    }
    
    // Attēlo pievienotos pielietojumus
    function renderPlacedComponents() {
        componentsPlaced.innerHTML = '';
        
        if (placedComponents.length === 0) {
            componentsPlaced.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-arrow-left"></i>
                    <p>Velciet pielietojumus šeit, lai izveidotu VR pieredzi</p>
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
                removeComponentFromVR(compId);
            });
        });
    }
    
    // Noņem pielietojumu no VR pieredzes
    function removeComponentFromVR(componentId) {
        placedComponents = placedComponents.filter(id => id !== componentId);
        renderPlacedComponents();
        updateVRStats();
        showMessage(`${componentDetails[componentId].name} noņemts no VR pieredzes.`, 'info');
    }
    
    // Atjauno VR statistiku
    function updateVRStats() {
        if (placedComponents.length === 0) {
            consoleStats.innerHTML = '<p>Vēl nav pievienoti pielietojumi</p>';
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
        
        // Aprēķina kopējo pieredzes vērtību
        const experienceScore = calculateExperienceScore();
        statsHTML += `
            <div class="stats-item">
                <span>Pieredzes vērtība:</span>
                <strong>${experienceScore}/100</strong>
            </div>
        `;
        
        consoleStats.innerHTML = statsHTML;
    }
    
    // Aprēķina VR pieredzes vērtību
    function calculateExperienceScore() {
        if (placedComponents.length === 0) return 0;
        
        let score = 0;
        const maxComponents = generationData[currentGeneration].components.length;
        
        // Punkti par katru pielietojumu
        score += (placedComponents.length / maxComponents) * 60;
        
        // Bonus punkti par daudzveidību
        if (placedComponents.length >= 3) {
            score += 20;
        }
        
        // Bonus punkti par visu komplektu
        if (placedComponents.length === maxComponents) {
            score += 20;
        }
        
        return Math.round(score);
    }
    
    // Iestata tehnoloģiju līmeņu pogas
    function setupGenerationButtons() {
        generationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Noņem aktīvo klasi no visām pogām
                generationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Pievieno aktīvo klasi nospiestajai pogai
                this.classList.add('active');
                
                // Atjauno pašreizējo līmeni
                currentGeneration = this.dataset.gen;
                
                // Atjauno līmeņa informāciju
                updateGenerationInfo(currentGeneration);
                
                // Notīra pievienotos pielietojumus
                placedComponents = [];
                renderPlacedComponents();
                updateVRStats();
                
                showMessage(`Pārslēgts uz ${generationData[currentGeneration].title}`, 'info');
            });
        });
    }
    
    // Atjauno līmeņa informāciju
    function updateGenerationInfo(generation) {
        const data = generationData[generation];
        generationInfo.innerHTML = `
            <p><strong>${data.title}</strong>: ${data.description}</p>
            <p><em>Pieejamie pielietojumi: ${data.components.map(comp => componentDetails[comp].name).join(', ')}</em></p>
        `;
    }
    
    // Iestata atiestatīšanas pogu
    function setupResetButton() {
        resetButton.addEventListener('click', function() {
            placedComponents = [];
            renderPlacedComponents();
            updateVRStats();
            showMessage('VR pieredze atiestatīta!', 'info');
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
