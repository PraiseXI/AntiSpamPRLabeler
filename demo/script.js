// Interactive PR Checker with enhanced UX
function checkPR() {
    const additions = parseInt(document.getElementById('additions').value) || 0;
    const deletions = parseInt(document.getElementById('deletions').value) || 0;
    const threshold = parseInt(document.getElementById('threshold').value) || 2;
    
    const totalChanges = additions + deletions;
    const resultDiv = document.getElementById('result');
    const checkBtn = document.querySelector('.check-btn');
    
    // Add loading state
    checkBtn.textContent = 'Analyzing...';
    checkBtn.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
    
    // Clear previous result with fade out
    const existingContent = resultDiv.querySelector('.result-content');
    if (existingContent) {
        existingContent.style.opacity = '0';
        existingContent.style.transform = 'translateY(-20px)';
        setTimeout(() => existingContent.remove(), 300);
    }
    
    setTimeout(() => {
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
                    <p><strong>Threshold:</strong> ≤ ${threshold} changes</p>
                    <p><strong>Action:</strong> PR would be labeled as "Potential Spam" and a helpful comment would be added for maintainer review.</p>
                    <p><strong>Why?</strong> PRs with very few changes often indicate spam, typo fixes, or low-effort contributions that may need special attention.</p>
                </div>
            `;
        } else {
            // Would not be flagged
            resultContent.innerHTML = `
                <div class="result-icon">✅</div>
                <h3 class="result-safe">Would NOT be flagged</h3>
                <div class="result-details">
                    <p><strong>Total Changes:</strong> ${totalChanges} (${additions} additions, ${deletions} deletions)</p>
                    <p><strong>Threshold:</strong> ≤ ${threshold} changes</p>
                    <p><strong>Action:</strong> PR would pass through normally without any special labeling or comments.</p>
                    <p><strong>Why?</strong> This PR has enough changes to be considered a substantial contribution and wouldn't trigger the spam detection.</p>
                </div>
            `;
        }
        
        resultDiv.appendChild(resultContent);
        
        // Add staggered animation
        resultContent.style.opacity = '0';
        resultContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            resultContent.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            resultContent.style.opacity = '1';
            resultContent.style.transform = 'translateY(0)';
        }, 100);
        
        // Reset button
        checkBtn.textContent = 'Check PR';
        checkBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        // Add success pulse to button
        checkBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            checkBtn.style.transform = 'scale(1)';
        }, 200);
        
    }, 500); // Delay to show loading state
}

// Enhanced copy code functionality
function copyCode() {
    const codeElement = document.getElementById('workflow-code');
    const text = codeElement.textContent;
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    
    // Add loading state
    copyBtn.textContent = 'Copying...';
    copyBtn.style.background = '#95a5a6';
    copyBtn.style.transform = 'scale(0.95)';
    
    navigator.clipboard.writeText(text).then(() => {
        // Success state
        copyBtn.innerHTML = '<span class="cta-icon">✅</span> Copied!';
        copyBtn.style.background = '#28a745';
        copyBtn.style.transform = 'scale(1.05)';
        
        // Add a subtle shake animation
        copyBtn.style.animation = 'copySuccess 0.6s ease';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '#667eea';
            copyBtn.style.transform = 'scale(1)';
            copyBtn.style.animation = '';
        }, 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        // Error state
        copyBtn.innerHTML = '<span class="cta-icon">❌</span> Failed';
        copyBtn.style.background = '#e74c3c';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '#667eea';
            copyBtn.style.transform = 'scale(1)';
        }, 2000);
    });
}

// Scroll animations and intersection observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-up animation to elements
    const elementsToAnimate = document.querySelectorAll('.problem-card, .feature, .step, .live-feature');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });
}

// Enhanced input validation and feedback
function addInputValidation() {
    const inputs = ['additions', 'deletions', 'threshold'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        
        input.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            
            // Add visual feedback for invalid values
            if (value < 0) {
                e.target.style.borderColor = '#e74c3c';
                e.target.style.backgroundColor = '#fdf2f2';
            } else {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = '#f0f4ff';
            }
            
            // Debounced check PR
            clearTimeout(e.target.timeout);
            e.target.timeout = setTimeout(() => {
                if (value >= 0) {
                    checkPR();
                }
            }, 500);
        });
        
        input.addEventListener('blur', function(e) {
            e.target.style.borderColor = '#e1e8ed';
            e.target.style.backgroundColor = '#fafbfc';
        });
    });
}

// Particle animation for background - Fixed z-index
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-10';
    canvas.style.opacity = '0.2';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }
    
    animateParticles();
}

// Auto-check on input change with enhanced UX
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollAnimations();
    addInputValidation();
    createParticles();
    
    // Initial check
    setTimeout(checkPR, 1000); // Slight delay for better UX
});

// Enhanced smooth scrolling
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

// Enhanced interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced hover effects for cards
    const interactiveCards = document.querySelectorAll('.problem-card, .live-feature, .step');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Enhanced CTA button effects
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Removed problematic parallax effect that was causing overlapping
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes copySuccess {
        0%, 100% { transform: scale(1.05); }
        25% { transform: scale(1.1) rotate(2deg); }
        75% { transform: scale(1.05) rotate(-2deg); }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .slide-in-up {
        animation: slideInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style); 