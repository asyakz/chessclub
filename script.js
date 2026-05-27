// БЕГУЩАЯ СТРОКА 
const marqueeHTML = `
<div class="marquee">
    <div class="marquee__inner">
        <span>Дело помощи утопающим — дело рук самих утопающих!</span>
        <span>Шахматы двигают вперёд не только культуру, но и экономику!</span>
        <span>Лёд тронулся, господа присяжные заседатели!</span>
        <span>Дело помощи утопающим — дело рук самих утопающих!</span>
        <span>Шахматы двигают вперёд не только культуру, но и экономику!</span>
        <span>Лёд тронулся, господа присяжные заседатели!</span>
    </div>
</div>
`;

const place1 = document.getElementById('placeForMarquee1');
const place2 = document.getElementById('placeForMarquee2');
if (place1) place1.innerHTML = marqueeHTML;
if (place2) place2.innerHTML = marqueeHTML;

//  ПЕРВЫЙ СЛАЙДЕР 

let current1 = 0;
const total1 = 7;

const prev1 = document.querySelector('.prev');
const next1 = document.querySelector('.next');
const dots1 = document.querySelector('.carousel-dots');
const grid1 = document.querySelector('.achievements-grid');


if (grid1 && dots1 && prev1 && next1) {
    for (let i = 0; i < total1; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.onclick = () => goToSlide1(i);
        dots1.appendChild(dot);
    }

    function updateDots1() {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current1);
        });
    }

    function goToSlide1(index) {
        if (index < 0 || index >= total1) return;
        current1 = index;
        const scrollPosition = grid1.clientWidth * current1;
        grid1.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        updateDots1();
        prev1.disabled = current1 === 0;
        next1.disabled = current1 === total1 - 1;
    }

    prev1.onclick = () => current1 > 0 && goToSlide1(current1 - 1);
    next1.onclick = () => current1 < total1 - 1 && goToSlide1(current1 + 1);

    grid1.addEventListener('scroll', () => {
        const newIndex = Math.round(grid1.scrollLeft / grid1.clientWidth);
        if (newIndex !== current1 && newIndex >= 0 && newIndex < total1) {
            current1 = newIndex;
            updateDots1();
            prev1.disabled = current1 === 0;
            next1.disabled = current1 === total1 - 1;
        }
    });

    if (window.innerWidth <= 768) {
        goToSlide1(0);
    }
}

// ВТОРОЙ СЛАЙДЕР 
let current2 = 0;
let total2 = 2;
let cardsPerSlide2 = 3; 

const track2 = document.querySelector('.slider-track-2');
const prev2 = document.querySelector('.slider-prev-2');
const next2 = document.querySelector('.slider-next-2');
const currentSpan2 = document.querySelector('.current-slide-2');
const totalSpan2 = document.querySelector('.total-slides-2');
const sliderContainer2 = document.querySelector('.participants-slider-2');

let autoInterval2 = null;
let isHovering2 = false;
let originalCards2 = [];

if (track2) {
    
    function saveOriginalCards() {
        if (originalCards2.length === 0) {
            originalCards2 = Array.from(document.querySelectorAll('.participant-card'));
        }
    }
    
    function getCardsPerSlide() {
        const width = window.innerWidth;
        if (width <= 768) return 1;      
        if (width <= 1260) return 2;     
        return 3;                         
    }
    
    function rebuildSlides2() {
        if (!track2) return;
        
        saveOriginalCards();
        track2.innerHTML = '';
        
        cardsPerSlide2 = getCardsPerSlide();
        
        for (let i = 0; i < originalCards2.length; i += cardsPerSlide2) {
            const slide = document.createElement('div');
            slide.className = 'slider-slide-2';
            slide.style.display = 'grid';
            slide.style.gridTemplateColumns = `repeat(${cardsPerSlide2}, 1fr)`;
            slide.style.gap = '20px';
            slide.style.padding = '10px';
            
            for (let j = 0; j < cardsPerSlide2 && i + j < originalCards2.length; j++) {
                slide.appendChild(originalCards2[i + j].cloneNode(true));
            }
            
            track2.appendChild(slide);
        }
        
        total2 = Math.ceil(originalCards2.length / cardsPerSlide2);
        if (totalSpan2) totalSpan2.textContent = total2;
        
        current2 = 0;
        updateSlider2();
    }
    
    function updateSlider2() {
        const slidesList = document.querySelectorAll('.slider-slide-2');
        if (slidesList.length === 0) return;
        
        const slideWidth = slidesList[0].offsetWidth;
        track2.style.transform = `translateX(-${current2 * slideWidth}px)`;
        
        if (currentSpan2) currentSpan2.textContent = current2 + 1;
        
    }

    function goToSlide2(index) {
        if (index < 0) index = total2 - 1;
        if (index >= total2) index = 0;
        current2 = index;
        updateSlider2();
    }

    function prevSlide2() { goToSlide2(current2 - 1); restartAuto2(); }
    function nextSlide2() { goToSlide2(current2 + 1); restartAuto2(); }

    function startAuto2() {
        if (autoInterval2) clearInterval(autoInterval2);
        autoInterval2 = setInterval(() => {
            if (!isHovering2) nextSlide2();
        }, 4000);
    }

    function stopAuto2() {
        if (autoInterval2) {
            clearInterval(autoInterval2);
            autoInterval2 = null;
        }
    }

    function restartAuto2() {
        stopAuto2();
        if (!isHovering2) startAuto2();
    }


    function handleResize2() {
        const newCardsPerSlide = getCardsPerSlide();
        if (newCardsPerSlide !== cardsPerSlide2) {
            rebuildSlides2();
            goToSlide2(0);
            restartAuto2();
        }
    }

    if (sliderContainer2) {
        sliderContainer2.onmouseenter = () => { isHovering2 = true; stopAuto2(); };
        sliderContainer2.onmouseleave = () => { isHovering2 = false; startAuto2(); };
    }

    if (prev2) prev2.onclick = prevSlide2;
    if (next2) next2.onclick = nextSlide2;

    window.addEventListener('resize', handleResize2);

    rebuildSlides2();
    startAuto2();
}