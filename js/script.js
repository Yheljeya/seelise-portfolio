// script.js
// Basic interactions: smooth scroll for nav, portfolio-card -> sample works, simple slider controls

document.addEventListener('DOMContentLoaded', function () {
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
  });

  // Slider logic
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

    // Optional: enable drag-to-scroll
    let isDown = false, startX, scrollLeft;
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
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1; // scroll-fast factor
      track.scrollLeft = scrollLeft - walk;
    });
  });

  // Accessible keyboard navigation for sliders
  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') slider.querySelector('.prev').click();
      if (e.key === 'ArrowRight') slider.querySelector('.next').click();
    });
  });

});
