# 🎨 Professional Portfolio Website

A modern, responsive, and professional portfolio website built with HTML, CSS, and JavaScript. Features an elegant "old money" color scheme and modular component-based architecture.

## ✨ Features

- **🎨 Modern Design**: Elegant "old money" color palette with professional aesthetics
- **📱 Fully Responsive**: Optimized for all devices and screen sizes
- **🧩 Modular Architecture**: Component-based structure for easy maintenance
- **⚡ Performance Optimized**: Lazy loading, debounced events, and efficient animations
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **🌙 Dark Mode**: Automatic dark mode support based on system preferences
- **📄 Print Friendly**: Optimized for printing
- **🔧 Easy Customization**: Well-organized CSS variables and modular components

## 📁 Project Structure

Sourabh_Portfolio/
├── index.html                      
├── README.md|                      
│
├── css/                           
│   ├── main.css
│   ├── components.css
│   └── responsive.css
│
├── css_pages/                      
│   └── pages.css
│
├── js/                             
│   ├── main.js
│   ├── componentLoader.js          
│   └── router.js                   
│
├── js_pages/                       
│   └── pages.js
│
├── components/                    
│   ├── navigation.html
│   ├── hero.html
│   ├── about.html
│   ├── skills.html
│   ├── projects.html
│   ├── contact.html
│   ├── meeting.html                
│   └── footer.html
│
├── book_meeting_service/          
│   ├── meeting.css
│   ├── meeting.js
│   ├── mock_interview.html
│   ├── mentorship.html
│   ├── gate_guidance.html
│   ├── ds_interview_prep.html
│   ├── technical_guidance.html
│   ├── ai_consultancy.html
│   ├── accessibility_ai.html
│   ├── quick_question.html
│   ├── keynote_speaking.html
│   └── product_ai_mock.html
│
└── assets/
    └── images/    
    └── logos/ 
    └── featured_posts/              


## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A local web server (for component loading)

### Installation

1. **Clone or download** the project files
2. **Start a local server** (required for component loading):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open** `http://localhost:8000` in your browser

### Quick Setup

1. **Customize Personal Information**:
   - Edit `index.html` to update the title and meta information
   - Replace `[Your Name]` placeholders in component files
   - Update contact information in `components/contact.html`

2. **Add Your Content**:
   - Replace placeholder images with your own
   - Update project descriptions in `components/projects.html`
   - Modify skills and percentages in `components/skills.html`
   - Customize the about section in `components/about.html`

3. **Customize Colors** (Optional):
   - Edit CSS variables in `css/main.css` to change the color scheme
   - The current "old money" palette uses deep greens and golds

## 🎨 Customization

### Color Scheme

The website uses CSS custom properties for easy color customization. Edit these variables in `css/main.css`:

```css
:root {
    --primary-green: #1a472a;    /* Main brand color */
    --secondary-green: #2d5a3d;  /* Secondary brand color */
    --accent-gold: #d4af37;      /* Accent color */
    --warm-gold: #b8860b;        /* Warm accent */
    --deep-navy: #1e3a5f;        /* Deep blue */
    --cream: #f5f5dc;            /* Light background */
    --off-white: #fafafa;        /* Off-white background */
    --charcoal: #2c2c2c;         /* Dark text */
}
```

### Typography

The website uses two main fonts:
- **Playfair Display**: For headings and titles
- **Inter**: For body text and UI elements

You can change fonts by updating the font imports in `index.html` and the CSS variables in `css/main.css`.

### Adding New Components

1. Create a new HTML file in the `components/` folder
2. Add the component to the component list in `js/componentLoader.js`
3. Add a container div in `index.html`
4. Create corresponding styles in `css/components.css`

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: Below 480px

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Supports high contrast mode
- **Alt Text**: Descriptive alt text for images

## 🔧 Technical Features

### Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Debounced Events**: Optimized scroll and resize handlers
- **Component Preloading**: Components are preloaded for faster rendering
- **Efficient Animations**: Hardware-accelerated CSS animations

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers

### SEO Features

- **Meta Tags**: Proper meta descriptions and keywords
- **Structured Data**: Semantic HTML for better search engine understanding
- **Fast Loading**: Optimized for Core Web Vitals
- **Mobile First**: Mobile-optimized design

## 📄 Sections Overview

### 1. Navigation
- Fixed navigation bar with smooth scrolling
- Mobile hamburger menu
- Active section highlighting

### 2. Hero Section
- Eye-catching introduction
- Call-to-action buttons
- Professional profile image
- Download CV functionality

### 3. About Section
- Personal introduction
- Statistics counter
- Professional image

### 4. Skills Section
- Animated skill bars
- Categorized skills display
- Progress indicators

### 5. Projects Section
- Project cards with hover effects
- Technology tags
- Live demo and source code links

### 6. Contact Section
- Contact form with validation
- Contact information
- Social media links

### 7. Meeting Section
- Meeting booking form
- Available time slots
- Project discussion benefits

### 8. Footer
- Quick links
- Contact information
- Social media links

## 🛠️ Development

### File Organization

The project follows a modular architecture:

- **Components**: Reusable HTML sections
- **CSS**: Organized by functionality (main, components, responsive)
- **JavaScript**: Separated by concern (main functionality, component loading)

### Adding New Features

1. **New Section**: Create component file → Add to loader → Style in CSS
2. **New Animation**: Add to CSS animations → Trigger in JavaScript
3. **New Form**: Create form HTML → Add validation in JavaScript

### Debugging

- Check browser console for JavaScript errors
- Use browser dev tools to inspect component loading
- Verify file paths for component loading

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify all files are in the correct locations
3. Ensure you're running a local web server
4. Check that all component files exist

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Next Steps

To enhance your portfolio:

1. **Add Real Content**: Replace placeholders with your actual information
2. **Add Real Images**: Replace placeholder images with your photos
3. **Add Real Projects**: Include your actual project screenshots and links
4. **Customize Colors**: Adjust the color scheme to match your brand
5. **Add Analytics**: Integrate Google Analytics or similar
6. **Add Blog**: Consider adding a blog section
7. **Add Portfolio**: Include more detailed project showcases

---

**Happy Coding! 🚀**
