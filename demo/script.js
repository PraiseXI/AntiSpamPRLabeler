// Interactive PR Checker
function checkPR() {
    const additions = parseInt(document.getElementById('additions').value) || 0;
    const deletions = parseInt(document.getElementById('deletions').value) || 0;
    const threshold = parseInt(document.getElementById('threshold').value) || 2;
    
    const totalChanges = additions + deletions;
    const resultDiv = document.getElementById('result');
    
    // Clear previous result
    resultDiv.innerHTML = '';
    
    // Create result content
    const resultContent = document.createElement('div');
    resultContent.className = 'result-content';
    
    if (totalChanges <= threshold) {
        // Would be flagged as spam
        resultContent.innerHTML = `
            <div class="result-icon">🚫</div>
            <h3 class="result-spam">Would be flagged as Potential Spam</h3>
            <div class="result-details">
                <p><strong>Total Changes:</strong> ${totalChanges} (${additions} additions, ${deletions} deletions)</p>
                <p><strong>Threshold:</strong> ${threshold}</p>
                <p><strong>Action:</strong> PR would be labeled as "Potential Spam" and a comment would be added.</p>
            </div>
        `;
    } else {
        // Would not be flagged
        resultContent.innerHTML = `
            <div class="result-icon">✅</div>
            <h3 class="result-safe">Would NOT be flagged</h3>
            <div class="result-details">
                <p><strong>Total Changes:</strong> ${totalChanges} (${additions} additions, ${deletions} deletions)</p>
                <p><strong>Threshold:</strong> ${threshold}</p>
                <p><strong>Action:</strong> PR would pass through normally without any special labeling.</p>
            </div>
        `;
    }
    
    resultDiv.appendChild(resultContent);
    
    // Add animation
    resultContent.style.opacity = '0';
    resultContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultContent.style.transition = 'all 0.5s ease';
        resultContent.style.opacity = '1';
        resultContent.style.transform = 'translateY(0)';
    }, 100);
}

// Copy code functionality
function copyCode() {
    const codeElement = document.getElementById('workflow-code');
    const text = codeElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#667eea';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Auto-check on input change
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['additions', 'deletions', 'threshold'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', checkPR);
    });
    
    // Initial check
    checkPR();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add floating animation to the PR example
    const prExample = document.querySelector('.pr-example');
    if (prExample) {
        let floatDirection = 1;
        setInterval(() => {
            const currentTransform = prExample.style.transform || 'translateY(0px)';
            const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || 0);
            
            if (currentY >= 10) floatDirection = -1;
            if (currentY <= -10) floatDirection = 1;
            
            prExample.style.transform = `translateY(${currentY + (floatDirection * 0.5)}px)`;
        }, 100);
    }
}); 