class ZKEggTimer {
    constructor() {
        this.launchDate = new Date('2025-07-28T00:00:00Z');
        this.selectedEgg = null;
        this.username = '';
        // Removed this.message as it will now be random

        this.animals = {
            phoenix: '🔥🐦',
            dragon: '🐉',
            lion: '🦁',
            eagle: '🦅',
            gorilla: '🦍'
        };

        this.hatchMessages = [
            "Welcome to the future! ZK is here!",
            "SP1 has landed! Prove the world's software!",
            "Zero-knowledge reborn! The future is now!",
            "ZK revolution begins! SP1 is live!",
            "Proof systems evolved! Welcome to Succinct!"
        ];

        // New array for random messages for download/share
        this.downloadMessages = [
            "🚀 Get ready for the Succinct Mainnet! The future of ZK is here!",
            "✨ Witness the power of ZKPs! Succinct is about to change everything.",
            "💡 Your ZK journey begins now! Succinct Mainnet is on its way!",
            "🌐 Decentralization, powered by ZK. Succinct is leading the charge!",
            "🔓 Unlock the future with Succinct. Proving the impossible, made real."
        ];

        this.init();
    }

    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.startCountdown();
        this.updateProgressRing();

        if (this.selectedEgg) {
            this.showSelectedEgg();
            this.lockEggSelection(); // Lock selection if an egg was already chosen
        }
    }

    loadSavedData() {
        const savedData = localStorage.getItem('zkEggTimer');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.selectedEgg = data.selectedEgg;
            this.username = data.username || '';
            // Removed loading of message

            // Update form fields
            document.getElementById('username').value = this.username;
            // document.getElementById('message').value = this.message; // Removed message input
        }
    }

    saveData() {
        const data = {
            selectedEgg: this.selectedEgg,
            username: this.username,
            // Removed message from saved data
        };
        localStorage.setItem('zkEggTimer', JSON.stringify(data));
    }

    setupEventListeners() {
        // Egg selection
        document.querySelectorAll('.egg-container').forEach(container => {
            container.addEventListener('click', (e) => {
                // Only allow selection if an egg hasn't been chosen yet
                if (!this.selectedEgg) {
                    this.selectEgg(container);
                }
            });
        });

        // Input fields
        document.getElementById('username').addEventListener('input', (e) => {
            this.username = e.target.value;
            this.updateUserInfo();
            this.saveData();
        });

        // Removed event listener for message input
        // document.getElementById('message').addEventListener('input', (e) => {
        //     this.message = e.target.value;
        //     this.updateUserInfo();
        //     this.saveData();
        // });

        // Action buttons
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareToTwitter();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadEgg();
        });
    }

    selectEgg(container) {
        // Remove previous selection
        document.querySelectorAll('.egg-container').forEach(c => {
            c.classList.remove('selected');
        });

        // Select new egg
        container.classList.add('selected');

        this.selectedEgg = {
            color: container.dataset.color,
            team: container.dataset.team,
            animal: container.dataset.animal, // Keep animal for hatch animation
            element: container.querySelector('.egg').className // Store class for re-applying
        };

        this.saveData();
        this.showSelectedEgg();
        this.lockEggSelection(); // Lock selection after an egg is chosen
    }

    lockEggSelection() {
        // Add a class to the body to trigger CSS for locking eggs
        document.body.classList.add('egg-locked');
        // Disable input fields after selection
        document.getElementById('username').disabled = true;
        // document.getElementById('message').disabled = true; // Removed message input
    }

    showSelectedEgg() {
        const section = document.getElementById('selectedEggSection');
        const selectedEggEl = document.getElementById('selectedEgg');
        const teamName = document.getElementById('selectedTeamName');
        const shareBtn = document.getElementById('shareBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        // Show the section
        section.style.display = 'block';

        // Update egg appearance
        selectedEggEl.className = this.selectedEgg.element + ' large-egg';

        // Update details
        teamName.textContent = `Team: ${this.selectedEgg.team}`;
        // Removed animalName update as per request
        
        // Update progress ring color
        const progressCircle = document.getElementById('progressCircle');
        progressCircle.style.stroke = this.selectedEgg.color;
        progressCircle.style.filter = `drop-shadow(0 0 10px ${this.selectedEgg.color}80)`;

        // Show buttons
        shareBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';

        // Update user info
        this.updateUserInfo();

        // Scroll to selected egg
        section.scrollIntoView({ behavior: 'smooth' });
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (this.username) {
            userInfo.textContent = `User: ${this.username}`; // Removed "Handle: " prefix
        } else {
            userInfo.textContent = 'Add your handle above'; // Updated message
        }
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.launchDate.getTime() - now;

            if (distance < 0) {
                this.handleLaunch();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            this.updateProgressRing();
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    updateProgressRing() {
        const now = new Date().getTime();
        const startOf2025 = new Date('2025-01-01T00:00:00Z').getTime();
        const totalDuration = this.launchDate.getTime() - startOf2025;
        const elapsed = now - startOf2025;
        
        // Ensure progress is not negative or greater than 1
        const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);

        const circle = document.getElementById('progressCircle');
        const circumference = 2 * Math.PI * 140; // r=140 from SVG
        const offset = circumference - (progress * circumference);

        if (circle) {
            circle.style.strokeDashoffset = offset;
        }
    }

    handleLaunch() {
        if (this.isLaunched || !this.selectedEgg) return;

        this.isLaunched = true;
        this.showHatchAnimation();
    }

    showHatchAnimation() {
        const hatchAnimation = document.getElementById('hatchAnimation');
        const hatchedAnimal = document.getElementById('hatchedAnimal');
        const hatchTitle = document.getElementById('hatchTitle');
        const hatchSubtitle = document.getElementById('hatchSubtitle');
        const crackingEgg = document.querySelector('.egg-crack');

        // Set egg color for cracking animation
        crackingEgg.style.background = `linear-gradient(135deg, ${this.selectedEgg.color}, ${this.selectedEgg.color}CC)`;

        // Set animal emoji
        hatchedAnimal.textContent = this.animals[this.selectedEgg.animal];

        // Set random message
        const randomMessage = this.hatchMessages[Math.floor(Math.random() * this.hatchMessages.length)];
        hatchTitle.textContent = `${this.selectedEgg.team}'s ${this.selectedEgg.animal.charAt(0).toUpperCase() + this.selectedEgg.animal.slice(1)} Hatched!`;
        hatchSubtitle.textContent = randomMessage;

        // Show animation
        hatchAnimation.style.display = 'flex';

        // Hide after 8 seconds
        setTimeout(() => {
            hatchAnimation.style.display = 'none';
        }, 8000);
    }

    shareToTwitter() {
        const tweetText = this.buildTweetText();
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
    }

    buildTweetText() {
        const timeLeft = this.getTimeLeft();
        // Get a random message for sharing
        const randomDownloadMessage = this.downloadMessages[Math.floor(Math.random() * this.downloadMessages.length)];
        
        let tweet = `🥚 I chose ${this.selectedEgg.team}'s egg for the @SuccinctLabs ZK Egg Timer! 🔮\n\n`;

        if (this.username) {
            tweet += `User: ${this.username}\n`; // Changed "Handle: " to "User: "
        }
        
        tweet += `Message: ${randomDownloadMessage}\n\n`; // Add random message

        tweet += `⏰ ${timeLeft} until Succinct Egg Hatch!\n\n`;
        tweet += ``; // Placeholder for potential link or hashtags

        return tweet;
    }

    getTimeLeft() {
        const now = new Date().getTime();
        const distance = this.launchDate.getTime() - now;

        if (distance < 0) return 'Launch Complete!';

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m`;
    }

    // New function to download the egg image
    downloadEgg() {
        if (!this.selectedEgg) {
            console.error("No egg selected to download.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 600; // Increased resolution for better download quality
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Draw background (semi-transparent dark)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the egg with a subtle gradient for 3D effect on canvas
        const eggX = canvas.width / 2;
        const eggY = canvas.height / 2 - 50; // Adjusted position for text below
        const eggWidth = 150;
        const eggHeight = 200;

        const gradient = ctx.createLinearGradient(eggX - eggWidth / 2, eggY - eggHeight / 2, eggX + eggWidth / 2, eggY + eggHeight / 2);
        gradient.addColorStop(0, this.selectedEgg.color);
        gradient.addColorStop(1, `${this.selectedEgg.color}CC`); // Slightly transparent version of the color for depth

        ctx.beginPath();
        ctx.ellipse(eggX, eggY, eggWidth / 2, eggHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        // Add a simple shine (approximation of CSS shine)
        const shineX = eggX + eggWidth * 0.1;
        const shineY = eggY - eggHeight * 0.2;
        const shineRadiusX = eggWidth * 0.15;
        const shineRadiusY = eggHeight * 0.1;
        ctx.beginPath();
        ctx.ellipse(shineX, shineY, shineRadiusX, shineRadiusY, -Math.PI / 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.closePath();

        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';

        // Team Name
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`Team: ${this.selectedEgg.team}`, eggX, eggY + eggHeight / 2 + 30); // Adjusted Y position

        // User Info (Handle only)
        ctx.font = '20px Arial';
        if (this.username) {
            ctx.fillText(`User: ${this.username}`, eggX, eggY + eggHeight / 2 + 65); // Adjusted Y position
        }

        // Random Custom Message
        const randomDownloadMessage = this.downloadMessages[Math.floor(Math.random() * this.downloadMessages.length)];
        ctx.font = '18px Arial';
        // Split message into lines if too long
        const words = randomDownloadMessage.split(' ');
        let line = '';
        const lines = [];
        const maxWidth = canvas.width - 40; // 20px padding on each side

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        let textY = eggY + eggHeight / 2 + 100; // Starting Y for the random message
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], eggX, textY + (i * 25)); // 25px line height
        }

        // Convert canvas to image and trigger download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `zk-egg-${this.selectedEgg.team.toLowerCase()}-${this.username || 'guest'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ZKEggTimer();
});

// Add some extra animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to eggs
    const eggs = document.querySelectorAll('.egg');
    eggs.forEach((egg, index) => {
        egg.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    });

    // Add hover effects to cubic boxes
    const cubicBoxes = document.querySelectorAll('.cubic-box');
    cubicBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            // Only apply hover effect if egg selection is not locked
            if (!document.body.classList.contains('egg-locked')) {
                box.style.transform = 'scale(1.05) rotateY(10deg)';
            }
        });

        box.addEventListener('mouseleave', () => {
            // Only apply hover effect if egg selection is not locked
            if (!document.body.classList.contains('egg-locked')) {
                box.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
    });

    // Add typing effect to the title
    const title = document.querySelector('.title');
    const titleText = title.textContent;
    title.textContent = '';

    let i = 0;
    const typeEffect = () => {
        if (i < titleText.length) {
            title.textContent += titleText.charAt(i);
            i++;
            setTimeout(typeEffect, 100);
        }
    };

    setTimeout(typeEffect, 500);
});

// Add floating animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }

    .egg-container:not(.selected):hover .egg {
        animation-play-state: paused;
        transform: translateY(-5px) scale(1.1);
    }
    
    /* Ensure selected egg also has its animation paused on hover */
    .egg-container.selected .egg {
        animation-play-state: paused;
    }

    .countdown-item {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(183, 83, 255, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(183, 83, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(183, 83, 255, 0); }
    }
`;
document.head.appendChild(style);
