// script.js
// Basic interactions: smooth scroll for nav, portfolio-card -> sample works, simple slider controls

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger menu functionality
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('active');
      }
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // "Work with me" button -> go to contact
  const workBtn = document.getElementById('workWithMeBtn');
  if (workBtn) {
    workBtn.addEventListener('click', () => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Portfolio preview cards -> scroll to sample works and focus correct row
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetKey = card.dataset.target; // portrait | event | studio
      let rowId = 'row-' + targetKey;
      const row = document.getElementById(rowId);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // small visual feedback: flash the row
        row.style.transition = 'box-shadow 0.3s ease';
        row.style.boxShadow = '0 6px 30px rgba(0,0,0,0.6)';
        setTimeout(() => row.style.boxShadow = '', 800);
      }
    });

    // Add touch support for mobile hover effects
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
    });
    
    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.classList.remove('touch-active');
      }, 300);
    });
  });

  // Slider logic with enhanced mobile support
  document.querySelectorAll('.slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const imgs = Array.from(track.querySelectorAll('img'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');

    // amount to scroll = width of one image + gap
    function scrollAmount(direction = 1) {
      if (!imgs[0]) return;
      const imgStyle = getComputedStyle(imgs[0]);
      const width = imgs[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || 20);
      return (width + gap) * direction;
    }

    // Function to update button states
    function updateButtonStates() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      
      // Disable prev button if at the beginning
      prevBtn.disabled = scrollLeft <= 0;
      
      // Disable next button if at the end (with small tolerance for rounding)
      // Also check if there's actually content to scroll
      nextBtn.disabled = maxScroll <= 1 || scrollLeft >= maxScroll - 1;
    }

    // Initial button state - delay to ensure images are loaded and layout is complete
    setTimeout(() => {
      updateButtonStates();
    }, 100);

    prevBtn.addEventListener('click', () => {
      if (!prevBtn.disabled) {
        track.scrollBy({ left: -scrollAmount(1), behavior: 'smooth' });
        // Update button states after scroll animation
        setTimeout(updateButtonStates, 300);
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (!nextBtn.disabled) {
        track.scrollBy({ left: scrollAmount(1), behavior: 'smooth' });
        // Update button states after scroll animation
        setTimeout(updateButtonStates, 300);
      }
    });

    // Update button states on scroll (for drag scrolling)
    track.addEventListener('scroll', updateButtonStates);

    // Enhanced drag-to-scroll with touch support
    let isDown = false, startX, scrollLeft, startY;
    
    // Mouse events
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('active');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    
    document.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('active');
    });
    
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1; // scroll-fast factor
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    track.addEventListener('touchstart', (e) => {
      isDown = true;
      track.classList.add('active');
      startX = e.touches[0].pageX - track.offsetLeft;
      startY = e.touches[0].pageY;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('touchend', () => {
      isDown = false;
      track.classList.remove('active');
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      
      const x = e.touches[0].pageX - track.offsetLeft;
      const y = e.touches[0].pageY;
      
      // Only prevent default if we're scrolling horizontally more than vertically
      const deltaX = Math.abs(x - startX);
      const deltaY = Math.abs(y - startY);
      
      if (deltaX > deltaY) {
        e.preventDefault();
        const walk = (x - startX) * 1;
        track.scrollLeft = scrollLeft - walk;
      }
    });

    // Add touch feedback to images
    imgs.forEach(img => {
      img.addEventListener('touchstart', () => {
        img.style.transform = 'scale(1.02)';
      });
      
      img.addEventListener('touchend', () => {
        setTimeout(() => {
          img.style.transform = '';
        }, 150);
      });
    });
  });

  // Accessible keyboard navigation for sliders
  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') slider.querySelector('.prev').click();
      if (e.key === 'ArrowRight') slider.querySelector('.next').click();
    });
  });

  // Add touch feedback for CTA button
  const ctaBtn = document.getElementById('workWithMeBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('touchstart', () => {
      ctaBtn.style.transform = 'scale(0.95)';
    });
    
    ctaBtn.addEventListener('touchend', () => {
      setTimeout(() => {
        ctaBtn.style.transform = '';
      }, 150);
    });
  }

  // Optimize animations for mobile devices
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  if (isMobile) {
    // Reduce animation intensity on mobile for better performance
    const homeImages = document.querySelectorAll('.home-images img');
    homeImages.forEach(img => {
      img.style.animationDuration = '6s'; // Slower animation on mobile
    });
  } else if (isTablet) {
    // Optimize for tablet
    const homeImages = document.querySelectorAll('.home-images img');
    homeImages.forEach(img => {
      img.style.animationDuration = '5s'; // Medium speed for tablet
    });
  }

  // Enhanced touch support for tablets
  if (isTablet) {
    // Add tablet-specific touch behaviors
    document.querySelectorAll('.portfolio-card').forEach(card => {
      let touchTimeout;
      
      card.addEventListener('touchstart', (e) => {
        // Clear any existing timeout
        clearTimeout(touchTimeout);
        
        // Add active state immediately
        card.classList.add('touch-active');
        
        // Set a timeout to show the overlay effect
        touchTimeout = setTimeout(() => {
          const overlay = card.querySelector('.overlay');
          if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.background = 'linear-gradient(180deg,rgba(255, 255, 255, 0) 0%, rgba(6, 6, 27, 0.8) 100%)';
          }
        }, 100);
      });
      
      card.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        
        // Delayed removal for better UX
        setTimeout(() => {
          card.classList.remove('touch-active');
          const overlay = card.querySelector('.overlay');
          if (overlay) {
            overlay.style.opacity = '';
            overlay.style.background = '';
          }
        }, 200);
      });
    });

    // Enhanced slider experience for tablets
    document.querySelectorAll('.slider-track').forEach(track => {
      let touchStartTime = 0;
      let touchStartX = 0;
      
      track.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
      });
      
      track.addEventListener('touchend', (e) => {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchEndX = e.changedTouches[0].clientX;
        const touchDistance = Math.abs(touchEndX - touchStartX);
        
        // If it's a quick swipe (less than 300ms and more than 50px), navigate
        if (touchDuration < 300 && touchDistance > 50) {
          const slider = track.closest('.slider');
          const direction = touchEndX > touchStartX ? 'prev' : 'next';
          const button = slider.querySelector(`.${direction}`);
          
          if (button && !button.disabled) {
            button.click();
          }
        }
      });
    });
  }

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate slider button states after orientation change
      document.querySelectorAll('.slider').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = maxScroll <= 1 || scrollLeft >= maxScroll - 1;
      });
    }, 300);
  });

});
