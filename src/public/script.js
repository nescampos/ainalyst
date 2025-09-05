// Socket.IO connection
const socket = io();

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const researchInput = document.getElementById('researchInput');
const sendResearchBtn = document.getElementById('sendResearchBtn');
const chatInterface = document.getElementById('chatInterface');
const resultsInterface = document.getElementById('resultsInterface');
const resultsContent = document.getElementById('resultsContent');
const resultsTitle = document.getElementById('resultsTitle');
const shareBtn = document.getElementById('shareBtn');
const presentationModeBtn = document.getElementById('presentationModeBtn');
const downloadPptxBtn = document.getElementById('downloadPptxBtn');
const downloadMarkdownBtn = document.getElementById('downloadMarkdownBtn');
const backToChatBtn = document.getElementById('backToChatBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = document.getElementById('loadingMessage');
const progressBar = document.getElementById('progressBar');
const historyList = document.getElementById('historyList');
const newResearchBtn = document.getElementById('newResearchBtn');
const noHistoryMessage = document.getElementById('noHistoryMessage');
const presentationContainer = document.getElementById('presentationContainer');
const resultsContentContainer = document.getElementById('resultsContentContainer');
const presentationFrame = document.getElementById('presentationFrame');

// Toast container
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

// Current research job
let currentJobId = null;
let currentFolderName = null;
let researchProgress = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    
    // Event listeners
    sendResearchBtn.addEventListener('click', sendResearch);
    researchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !researchInput.disabled) {
            sendResearch();
        }
    });
    
    backToChatBtn.addEventListener('click', () => {
        // Hide presentation if visible
        if (!presentationContainer.classList.contains('d-none')) {
            presentationContainer.classList.add('d-none');
            resultsContentContainer.classList.remove('d-none');
            return;
        }
        
        resultsInterface.classList.add('d-none');
        chatInterface.classList.remove('d-none');
        // Ensure input is enabled when returning to chat
        researchInput.disabled = false;
        sendResearchBtn.disabled = false;
        researchInput.placeholder = 'Enter your research question...';
    });
    
    newResearchBtn.addEventListener('click', () => {
        // Hide presentation if visible
        if (!presentationContainer.classList.contains('d-none')) {
            presentationContainer.classList.add('d-none');
            resultsContentContainer.classList.remove('d-none');
            return;
        }
        
        resultsInterface.classList.add('d-none');
        chatInterface.classList.remove('d-none');
        researchInput.focus();
        // Ensure input is enabled when starting new research
        researchInput.disabled = false;
        sendResearchBtn.disabled = false;
        researchInput.placeholder = 'Enter your research question...';
    });
    
    // Share button
    shareBtn.addEventListener('click', () => {
        if (currentFolderName) {
            shareResearch(currentFolderName);
        } else {
            showToast('No research selected to share', 'error');
        }
    });
    
    // Presentation mode button
    presentationModeBtn.addEventListener('click', () => {
        if (currentFolderName) {
            // Show presentation in iframe
            presentationFrame.src = `/presentation.html?folder=${currentFolderName}`;
            resultsContentContainer.classList.add('d-none');
            presentationContainer.classList.remove('d-none');
        } else {
            showToast('No research selected for presentation', 'error');
        }
    });
    
    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
        if (event.data.action === 'closePresentation') {
            presentationContainer.classList.add('d-none');
            resultsContentContainer.classList.remove('d-none');
        }
    });
    
    // Download button event listeners
    downloadPptxBtn.addEventListener('click', (e) => {
        if (!currentFolderName) {
            e.preventDefault();
            showToast('No presentation available for download', 'error');
        }
    });
    
    downloadMarkdownBtn.addEventListener('click', (e) => {
        if (!currentFolderName) {
            e.preventDefault();
            showToast('No markdown file available for download', 'error');
        } else {
            // Create download link dynamically
            e.preventDefault();
            const downloadUrl = `/api/download/markdown/${currentFolderName}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${currentFolderName}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Markdown file downloaded successfully', 'success');
        }
    });
});

// Send research request
function sendResearch() {
    const query = researchInput.value.trim();
    
    if (!query) {
        showToast('Please enter a research question', 'error');
        return;
    }
    
    // Add user message to chat
    addMessageToChat(query, 'sent');
    
    // Disable input and button during research
    researchInput.disabled = true;
    sendResearchBtn.disabled = true;
    researchInput.placeholder = 'Research in progress...';
    
    // Clear input
    researchInput.value = '';
    
    // Reset progress
    researchProgress = 0;
    updateProgressBar();
    
    // Show loading overlay
    showLoading('🚀 Initializing research process...');
    
    // Send research request to server
    fetch('/api/research', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        currentJobId = data.jobId;
        showToast('Research started successfully!', 'success');
    })
    .catch(error => {
        hideLoading();
        // Re-enable input and button on error
        researchInput.disabled = false;
        sendResearchBtn.disabled = false;
        researchInput.placeholder = 'Enter your research question...';
        addMessageToChat(`Error: ${error.message}`, 'received');
        showToast(`Error: ${error.message}`, 'error');
        console.error('Error:', error);
    });
}

// Add message to chat
function addMessageToChat(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} mb-3`;
    
    const avatarIcon = type === 'sent' ? 'fa-user' : 'fa-robot';
    const avatarBg = type === 'sent' ? 'bg-success' : 'bg-primary';
    
    messageDiv.innerHTML = `
        <div class="d-flex">
            <div class="avatar ${avatarBg} text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 30px; height: 30px;">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content bg-light p-3 rounded">
                <p class="mb-0">${content}</p>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show loading overlay
function showLoading(message) {
    loadingMessage.textContent = message;
    loadingOverlay.classList.remove('d-none');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.add('d-none');
}

// Update progress bar
function updateProgressBar() {
    if (progressBar) {
        progressBar.style.width = `${researchProgress}%`;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('d-none');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Load research history
function loadHistory() {
    fetch('/api/history')
        .then(response => response.json())
        .then(history => {
            renderHistory(history);
        })
        .catch(error => {
            console.error('Error loading history:', error);
            showToast('Error loading research history', 'error');
        });
}

// Render history list
function renderHistory(history) {
    if (history.length === 0) {
        noHistoryMessage.style.display = 'block';
        return;
    }
    
    noHistoryMessage.style.display = 'none';
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="title">${item.name}</div>
            <div class="date">${new Date(item.createdAt).toLocaleDateString()}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.history-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to clicked item
            historyItem.classList.add('active');
            
            // Load the research result
            loadResearchResult(item.folderName);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Load research result
function loadResearchResult(folderName) {
    showLoading('📂 Loading research results...');
    researchProgress = 30;
    updateProgressBar();
    
    fetch(`/api/results/${folderName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            researchProgress = 70;
            updateProgressBar();
            
            // Store current folder name for downloads
            currentFolderName = folderName;
            
            // Switch to results interface
            chatInterface.classList.add('d-none');
            resultsInterface.classList.remove('d-none');
            
            // Make sure we're showing results content, not presentation
            presentationContainer.classList.add('d-none');
            resultsContentContainer.classList.remove('d-none');
            
            // Set results title
            resultsTitle.textContent = folderName.replace(/_/g, ' ');
            
            // Set presentation download link
            if (data.hasPresentation) {
                downloadPptxBtn.href = data.presentationPath;
                downloadPptxBtn.classList.remove('d-none');
            } else {
                downloadPptxBtn.classList.add('d-none');
            }
            
            researchProgress = 100;
            updateProgressBar();
            
            // Render markdown content as HTML
            resultsContent.innerHTML = renderMarkdown(data.reportContent);
            
            hideLoading();
            showToast('Research results loaded successfully', 'success');
        })
        .catch(error => {
            hideLoading();
            showToast(`Error loading results: ${error.message}`, 'error');
            console.error('Error loading results:', error);
        });
}

// Simple markdown to HTML conversion
function renderMarkdown(markdown) {
    // Convert headers
    let html = markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // Convert bold and italic
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Convert lists
    html = html
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/g, '');
    
    // Convert numbered lists
    html = html
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/<li>(.*?)<\/li>/g, '<ol><li>$1</li></ol>')
        .replace(/<\/ol>\s*<ol>/g, '');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert paragraphs
    html = html.replace(/^\s*$(.*?)^\s*$/gm, '<p>$1</p>');
    
    // Handle line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// Socket.IO event handlers
socket.on('researchStarted', (data) => {
    console.log('Research started:', data);
    showLoading('🚀 Initializing research process...');
    researchProgress = 10;
    updateProgressBar();
    addMessageToChat('🚀 Research process started...', 'received');
});

socket.on('researchStatus', (data) => {
    console.log('Research status:', data);
    showLoading(data.message);
    
    // Update progress based on status
    switch (data.status) {
        case 'initializing':
            researchProgress = 15;
            break;
        case 'planning':
            researchProgress = 25;
            break;
        case 'researching':
            researchProgress = 40;
            break;
        case 'generating':
            researchProgress = 60;
            break;
        case 'saving':
            researchProgress = 80;
            break;
        case 'presenting':
            researchProgress = 90;
            break;
    }
    updateProgressBar();
    
    // Add status message to chat for better visibility with indicator
    let indicatorClass = '';
    switch (data.status) {
        case 'initializing':
            indicatorClass = 'initializing';
            break;
        case 'planning':
            indicatorClass = 'planning';
            break;
        case 'researching':
            indicatorClass = 'researching';
            break;
        case 'generating':
            indicatorClass = 'generating';
            break;
        case 'saving':
            indicatorClass = 'saving';
            break;
        case 'presenting':
            indicatorClass = 'presenting';
            break;
    }
    
    if (data.status === 'planning') {
        addStatusMessage('🧠 Planning research approach...', indicatorClass);
    } else if (data.status === 'researching') {
        addStatusMessage(`🔍 ${data.message}`, indicatorClass);
    } else if (data.status === 'generating') {
        addStatusMessage('📝 Generating comprehensive report...', indicatorClass);
    } else if (data.status === 'saving') {
        addStatusMessage('💾 Saving research report...', indicatorClass);
    } else if (data.status === 'presenting') {
        addStatusMessage('📊 Creating presentation slides...', indicatorClass);
    }
});

socket.on('researchCompleted', (data) => {
    console.log('Research completed:', data);
    
    // Add completion message to chat
    addStatusMessage('✅ Research completed successfully! Loading results...', 'completed');
    
    researchProgress = 100;
    updateProgressBar();
    
    // Re-enable input and button
    researchInput.disabled = false;
    sendResearchBtn.disabled = false;
    researchInput.placeholder = 'Enter your research question...';
    
    // Load the results after a short delay
    setTimeout(() => {
        loadResearchResult(data.folderName);
        loadHistory(); // Refresh history
    }, 1500);
    
    showToast('Research completed successfully!', 'success');
});

socket.on('researchFailed', (data) => {
    console.log('Research failed:', data);
    hideLoading();
    addStatusMessage(`❌ Research failed: ${data.error}`, 'failed');
    
    // Re-enable input and button on failure
    researchInput.disabled = false;
    sendResearchBtn.disabled = false;
    researchInput.placeholder = 'Enter your research question...';
    
    showToast(`Research failed: ${data.error}`, 'error');
});

// Add status message with indicator to chat
function addStatusMessage(content, statusClass) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message received mb-2';
    
    messageDiv.innerHTML = `
        <div class="d-flex">
            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 30px; height: 30px;">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content bg-light p-3 rounded">
                <div class="status-message">
                    <span class="status-indicator ${statusClass}"></span>
                    <span>${content}</span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Share research function
function shareResearch(folderName) {
    // Create the shareable URL
    // The folderName already has underscores instead of spaces, which is correct for URLs
    const shareUrl = `${window.location.origin}/shared/${folderName}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Research shared successfully! Link copied to clipboard.', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Show the URL in a toast if copying fails
        showToast(`Share this link: ${shareUrl}`, 'info');
    });
}