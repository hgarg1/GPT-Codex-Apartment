# GPT Codex Apartment

A clean, simple, and well-structured HTML/CSS/JavaScript web application with a lightweight Flask backend for the resident portal experience.

## Features

- **Clean HTML Structure**: Semantic HTML5 with proper document structure
- **Modern CSS**: Responsive design with CSS Grid and Flexbox
- **Interactive JavaScript**: Smooth scrolling, form handling, resident portal auth flows, and scroll animations
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Accessibility**: Proper semantic markup and ARIA labels
- **Resident Portal**: Account creation and login connected to a local SQLite database

## Project Structure

```
GPT-Codex-Apartment/
├── app.py            # Flask application serving the API and static assets
├── index.html        # Main HTML file
├── styles.css        # CSS styling
├── script.js         # JavaScript functionality
├── requirements.txt  # Python dependencies for the backend
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/hgarg1/GPT-Codex-Apartment.git
   cd GPT-Codex-Apartment
   ```

2. Install backend dependencies (Python 3.10+ recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   flask --app app run --debug
   ```

   The site and API will be available at `http://127.0.0.1:5000/`. The resident portal uses a local SQLite database stored in `residents.db` (ignored by git).

4. To serve the static files without the backend (limited functionality), open `index.html` directly in your browser or run:
   ```bash
   python -m http.server 8000
   ```
   Note that resident authentication requires the Flask API.

## Features Included

- **Navigation**: Smooth scrolling navigation menu
- **Hero Section**: Eye-catching landing section with call-to-action
- **Feature Cards**: Grid layout showcasing key features
- **Resident Portal**: Dedicated account creation, login, and authenticated dashboard messaging
- **Contact Form**: Functional form with validation
- **Responsive Design**: Mobile-first approach with media queries
- **Scroll Animations**: Cards fade in as you scroll

## Technologies Used

- HTML5
- CSS3 (with CSS Variables, Grid, Flexbox)
- Vanilla JavaScript (ES6+)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or as a template for your own projects.