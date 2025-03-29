document.addEventListener('DOMContentLoaded', function() {
  // 添加图标到编辑按钮
  const toggleEditBtn = document.getElementById('toggle-edit');
  if (toggleEditBtn) {
    toggleEditBtn.innerHTML = '<i class="fa-solid fa-edit"></i>';
  }
  
  fetchLinks();
  setupMobileNav();
  setupTouchInteractions();
  setupBottomNav();
  setupPullToRefresh();
  setupEditForm();
});

// Setup mobile navigation
function setupMobileNav() {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('nav');
  
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isOpen = nav.classList.contains('active');
      mobileNavToggle.innerHTML = isOpen ? 
        '<i class="fa-solid fa-xmark"></i>' : 
        '<i class="fa-solid fa-bars"></i>';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 480) {
          nav.classList.remove('active');
          mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });
    });
  }
}

// Add touch optimizations
function setupTouchInteractions() {
  // Add active class for links on touch devices
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    card.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });
  
  // Add smooth scrolling for hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70, // Account for header height
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Hide address bar on mobile when possible
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.scrollTo(0, 1);
    }, 0);
  });
}

// Setup bottom navigation highlighting
function setupBottomNav() {
  const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
  if (bottomNavLinks.length) {
    // Initial active state based on scroll position
    updateActiveNavLink();
    
    // Update active state on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Click handling for bottom nav
    bottomNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
          });
          
          // Update active state
          bottomNavLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });
  }
}

// Update active navigation based on scroll position
function updateActiveNavLink() {
  const scrollPosition = window.scrollY;
  
  // Get all section positions
  const sections = document.querySelectorAll('main section');
  const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
  
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      const sectionId = section.getAttribute('id');
      
      // Update bottom nav
      bottomNavLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === sectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

// Setup pull-to-refresh functionality
function setupPullToRefresh() {
  let touchStartY = 0;
  let touchEndY = 0;
  const minPullDistance = 80; // Minimum pull distance to trigger refresh
  const body = document.body;
  const ptrIndicator = document.querySelector('.ptr-indicator');
  
  if (ptrIndicator && 'ontouchstart' in window) {
    // Touch start event
    document.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
      
      // Only enable pull-to-refresh at the top of the page
      if (window.scrollY <= 5) {
        body.classList.add('ptr-ready');
      }
    }, { passive: true });
    
    // Touch move event
    document.addEventListener('touchmove', function(e) {
      if (!body.classList.contains('ptr-ready')) return;
      
      touchEndY = e.touches[0].clientY;
      const distance = touchEndY - touchStartY;
      
      if (distance > 0 && window.scrollY <= 0) {
        // Show pull indicator based on distance
        const pullPercent = Math.min(distance / minPullDistance, 1);
        ptrIndicator.style.transform = `translateY(${-50 + (pullPercent * 50)}px)`;
        
        if (distance >= minPullDistance) {
          body.classList.add('ptr-active');
          ptrIndicator.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> 释放刷新';
        } else {
          body.classList.remove('ptr-active');
          ptrIndicator.innerHTML = '<i class="fa-solid fa-arrow-down"></i> 下拉刷新';
        }
        
        // Prevent default scrolling when pulling
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });
    
    // Touch end event
    document.addEventListener('touchend', function() {
      if (!body.classList.contains('ptr-ready')) return;
      
      const distance = touchEndY - touchStartY;
      
      // Reset pull indicator
      ptrIndicator.style.transform = '';
      body.classList.remove('ptr-ready');
      
      // If pulled enough, refresh content
      if (distance >= minPullDistance) {
        refreshContent();
      } else {
        body.classList.remove('ptr-active');
      }
      
      touchStartY = 0;
      touchEndY = 0;
    }, { passive: true });
  }
}

// Refresh the content
async function refreshContent() {
  const body = document.body;
  const loadingSpinner = document.getElementById('loading-spinner');
  const ptrIndicator = document.querySelector('.ptr-indicator');
  
  try {
    // Show loading state
    body.classList.add('loading');
    loadingSpinner.style.display = 'block';
    
    // Hide pull indicator after a short delay
    setTimeout(() => {
      body.classList.remove('ptr-active');
      ptrIndicator.style.transform = '';
    }, 300);
    
    // Fetch fresh data
    await fetchLinks();
    
    // Success feedback
    showToast('刷新成功');
  } catch (error) {
    // Error feedback
    showToast('刷新失败，请重试');
    console.error('Refresh error:', error);
  } finally {
    // Hide loading state
    body.classList.remove('loading');
    loadingSpinner.style.display = 'none';
  }
}

// Show a toast notification
function showToast(message) {
  // Create toast element if not exists
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
    
    // Add styles if not in CSS
    toast.style.position = 'fixed';
    toast.style.bottom = '100px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = '#fff';
    toast.style.padding = '8px 16px';
    toast.style.borderRadius = '4px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '10000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
  }
  
  // Set message and show
  toast.textContent = message;
  toast.style.opacity = '1';
  
  // Hide after delay
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2000);
}

async function fetchLinks() {
  try {
    document.body.classList.add('loading');
    
    // 检测是否在本地文件系统运行
    const isLocalFile = window.location.protocol === 'file:';
    
    if (isLocalFile) {
      // 如果是本地文件系统运行，使用模拟数据
      console.log('在本地文件系统运行，使用模拟数据');
      // 等待一秒，模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      renderLinks(getDefaultLinks());
      showToast('使用本地模拟数据');
    } else {
      // 正常请求API
      const response = await fetch('/api/links');
      const links = await response.json();
      renderLinks(links);
    }
  } catch (error) {
    console.error('Error fetching links:', error);
    // 出错时也尝试使用默认数据
    showToast('加载失败，使用默认数据');
    renderLinks(getDefaultLinks());
  } finally {
    document.body.classList.remove('loading');
  }
}

function renderLinks(links) {
  document.querySelectorAll('.link-grid').forEach(grid => grid.innerHTML = '');

  const linksByCategory = groupBy(links, 'category');
  for (const [category, categoryLinks] of Object.entries(linksByCategory)) {
    const section = document.querySelector(`#${category} .link-grid`);
    if (section) {
      categoryLinks.forEach(link => {
        const linkCard = createLinkCard(link);
        section.appendChild(linkCard);
      });
    }
  }
}

function createLinkCard(link) {
  const div = document.createElement('div');
  div.className = 'link-card';
  div.setAttribute('href', link.url);
  div.setAttribute('aria-label', `打开 ${link.title}`); // Accessibility improvement
  div.innerHTML = `
    <i class="${link.icon}" aria-hidden="true"></i>
    <h3>${link.title}</h3>
  `;
  div.addEventListener('click', function() {
    window.open(link.url, '_blank', 'noopener');
  });
  return div;
}

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}

// Setup edit form handling
function setupEditForm() {
  const toggleEditBtn = document.getElementById('toggle-edit');
  const editForm = document.getElementById('edit-form');
  const closeFormBtn = document.querySelector('.close-form');
  
  if (!toggleEditBtn || !editForm) {
    console.error('编辑表单或编辑按钮元素未找到');
    return;
  }
  
  console.log('设置编辑表单处理程序');
  
  // Toggle edit form visibility
  toggleEditBtn.addEventListener('click', function() {
    console.log('点击了编辑按钮');
    if (window.innerWidth <= 480) {
      // Mobile specific handling with slide-up animation
      editForm.classList.toggle('active');
      console.log('移动端模式，切换active类');
    } else {
      // Desktop handling
      const newDisplay = editForm.style.display === 'none' ? 'block' : 'none';
      console.log('桌面端模式，设置display为:', newDisplay);
      editForm.style.display = newDisplay;
      
      // Scroll to form when opened on desktop
      if (newDisplay === 'block') {
        editForm.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  // Close form button (mobile)
  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', function() {
      if (window.innerWidth <= 480) {
        editForm.classList.remove('active');
      } else {
        editForm.style.display = 'none';
      }
    });
  }
  
  // Handle form submission
  document.getElementById('link-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const linkData = Object.fromEntries(formData);
    
    try {
      // Show loading indicator
      document.body.classList.add('loading');
      
      // 检测是否在本地文件系统运行
      const isLocalFile = window.location.protocol === 'file:';
      
      if (isLocalFile) {
        // 本地模式下，只显示成功消息但不实际保存
        await new Promise(resolve => setTimeout(resolve, 800)); // 模拟网络延迟
        showToast('本地模式：链接模拟保存成功');
        this.reset();
        
        // Close form on mobile
        if (window.innerWidth <= 480) {
          editForm.classList.remove('active');
        }
      } else {
        // 正常API提交
        const response = await fetch('/api/links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: linkData.edit_password,
            link: {
              category: linkData.category,
              title: linkData.title,
              url: linkData.url,
              icon: linkData.icon
            }
          }),
        });

        if (response.ok) {
          showToast('链接已保存');
          fetchLinks();
          this.reset();
          
          // Close form on mobile
          if (window.innerWidth <= 480) {
            editForm.classList.remove('active');
          }
        } else {
          const errorText = await response.text();
          showToast('保存失败: ' + errorText);
        }
      }
    } catch (error) {
      console.error('Error saving link:', error);
      showToast('保存失败，请检查网络连接');
    } finally {
      document.body.classList.remove('loading');
    }
  });
}

// 提供默认链接数据，当API不可用时使用
function getDefaultLinks() {
  return [
    // AI搜索
    { category: 'ai-search', title: 'Google', url: 'https://www.google.com', icon: 'fa-brands fa-google' },
    { category: 'ai-search', title: 'Bing', url: 'https://www.bing.com', icon: 'fa-brands fa-microsoft' },
    { category: 'ai-search', title: '傻豆包', url: 'https://www.doubao.com/chat', icon: 'fa-solid fa-paw' },
    { category: 'ai-search', title: 'ChatGPT', url: 'https://chat.openai.com/', icon: 'fa-solid fa-robot' },
    { category: 'ai-search', title: 'Perplexity', url: 'https://www.perplexity.ai/', icon: 'fa-solid fa-brain' },
    { category: 'ai-search', title: 'Claude', url: 'https://claude.ai/', icon: 'fa-solid fa-robot' },
    
    // 社交媒体
    { category: 'social', title: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-brands fa-youtube' },
    { category: 'social', title: 'Twitter', url: 'https://twitter.com', icon: 'fa-brands fa-twitter' },
    { category: 'social', title: 'Reddit', url: 'https://www.reddit.com', icon: 'fa-brands fa-reddit' },
    { category: 'social', title: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'fa-brands fa-linkedin' },
    { category: 'social', title: 'Facebook', url: 'https://www.facebook.com', icon: 'fa-brands fa-facebook' },
    { category: 'social', title: 'Instagram', url: 'https://www.instagram.com', icon: 'fa-brands fa-instagram' },
    
    // 实用工具
    { category: 'tools', title: 'Gmail', url: 'https://mail.google.com', icon: 'fa-solid fa-envelope' },
    { category: 'tools', title: 'Google翻译', url: 'https://translate.google.com', icon: 'fa-solid fa-language' },
    { category: 'tools', title: 'Google地图', url: 'https://maps.google.com', icon: 'fa-solid fa-map-location-dot' },
    { category: 'tools', title: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github' },
    { category: 'tools', title: 'Cloudflare', url: 'https://dash.cloudflare.com', icon: 'fa-solid fa-cloud' },
    { category: 'tools', title: 'AWS控制台', url: 'https://aws.amazon.com/console', icon: 'fa-brands fa-aws' },
    
    // 科技资讯
    { category: 'tech-news', title: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'fa-solid fa-newspaper' },
    { category: 'tech-news', title: 'TechCrunch', url: 'https://techcrunch.com', icon: 'fa-solid fa-rss' },
    { category: 'tech-news', title: 'The Verge', url: 'https://theverge.com', icon: 'fa-solid fa-bolt' },
    { category: 'tech-news', title: 'Wired', url: 'https://wired.com', icon: 'fa-solid fa-wifi' },
    { category: 'tech-news', title: 'MIT科技评论', url: 'https://www.technologyreview.com', icon: 'fa-solid fa-graduation-cap' },
    { category: 'tech-news', title: 'CNET', url: 'https://www.cnet.com', icon: 'fa-solid fa-microchip' },
    
    // 云存储
    { category: 'cloud-storage', title: 'Google Drive', url: 'https://drive.google.com', icon: 'fa-brands fa-google-drive' },
    { category: 'cloud-storage', title: 'Dropbox', url: 'https://www.dropbox.com', icon: 'fa-brands fa-dropbox' },
    { category: 'cloud-storage', title: 'OneDrive', url: 'https://onedrive.live.com', icon: 'fa-solid fa-cloud' },
    { category: 'cloud-storage', title: 'iCloud', url: 'https://www.icloud.com', icon: 'fa-brands fa-apple' },
    { category: 'cloud-storage', title: 'MEGA', url: 'https://mega.nz', icon: 'fa-solid fa-hard-drive' },
    { category: 'cloud-storage', title: 'Box', url: 'https://www.box.com', icon: 'fa-solid fa-box' },
    
    // 电子邮箱
    { category: 'email', title: 'Gmail', url: 'https://mail.google.com', icon: 'fa-solid fa-envelope' },
    { category: 'email', title: 'Outlook', url: 'https://outlook.live.com', icon: 'fa-brands fa-microsoft' },
    { category: 'email', title: 'Yahoo邮箱', url: 'https://mail.yahoo.com', icon: 'fa-brands fa-yahoo' },
    { category: 'email', title: 'ProtonMail', url: 'https://mail.proton.me', icon: 'fa-solid fa-lock' },
    { category: 'email', title: 'Zoho Mail', url: 'https://mail.zoho.com', icon: 'fa-solid fa-at' },
    { category: 'email', title: 'QQ邮箱', url: 'https://mail.qq.com', icon: 'fa-brands fa-qq' }
  ];
}
