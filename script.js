// 스크롤 시 네비게이션 바 그림자 효과 및 섹션 등장 애니메이션

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // 스무스 스크롤 (네비게이션 링크 클릭 시)
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 헤더 높이만큼 오프셋
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer를 활용한 스크롤 애니메이션 (Fade-in 효과)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 20% 보일 때 실행
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 클래스 이름에 'animate-on-scroll'을 추가하여 CSS 트랜지션을 작동시킬 수 있습니다.
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 섹션 타이틀 및 콘텐츠에 관찰자 연결 (초기 스타일은 CSS 또는 JS로 설정)
    const fadeElements = document.querySelectorAll('.story-text, .product-card, .benefits-box');
    
    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // 페이지 로드 시 장바구니 뱃지 초기화
    updateCartBadge();
});

// 장바구니 뱃지 업데이트 기능
function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('nolac_cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalCount;
        if (totalCount > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// 장바구니 담기 기능
function addToCart(productName) {
    let cart = JSON.parse(localStorage.getItem('nolac_cart')) || [];
    
    // 장바구니에 이미 있는지 확인
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, quantity: 1 });
    }
    
    localStorage.setItem('nolac_cart', JSON.stringify(cart));
    
    // 장바구니 뱃지 UI 업데이트
    updateCartBadge();
    
    // 장바구니 아이콘 애니메이션 효과
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.classList.remove('bounce'); // 기존 애니메이션 리셋
        void icon.offsetWidth; // DOM 리플로우 강제 발생
        icon.classList.add('bounce');
    });
}
