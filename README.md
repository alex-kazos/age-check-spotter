# AgeCheck Spotter

AgeCheck Spotter is a comprehensive web application designed to help businesses verify the age of their customers quickly and efficiently. This tool is particularly useful for establishments that need to ensure compliance with age restrictions, such as bars, nightclubs, or stores selling age-restricted products.

## Features

- Quick and accurate age verification
- Face recognition technology for identity confirmation
- User-friendly interface for both staff and customers
- Customizable age thresholds to meet different regulatory requirements
- Real-time results with detailed verification reports
- Secure storage of verification data
- Dark mode support for various lighting conditions

## Technologies Used

This project is built with a modern tech stack:

- Frontend:
  - [Vite](https://vitejs.dev/) for fast development and building
  - [React](https://reactjs.org/) for building the user interface
  - [shadcn/ui](https://ui.shadcn.com/) for beautiful and customizable UI components
  - [Tailwind CSS](https://tailwindcss.com/) for responsive and efficient styling
  - [Framer Motion](https://www.framer.com/motion/) for smooth animations

- Backend:
  - [Flask](https://flask.palletsprojects.com/) for the API server
  - [OpenCV](https://opencv.org/) and [face-recognition](https://github.com/ageitgey/face_recognition) libraries for image processing and face recognition

## Requirements

To run this project, you need:

- Node.js (v14 or later)
- Python (v3.7 or later)
- npm or yarn package manager
- A webcam or camera device for capturing images

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/GPT-Engineer-App/agecheck-spotter.git
   ```

2. Navigate to the project directory:
   ```sh
   cd agecheck-spotter
   ```

3. Install frontend dependencies:
   ```sh
   npm install
   ```

4. Install backend dependencies:
   ```sh
   pip install -r requirements.txt
   ```

5. Start the development servers:
   ```sh
   npm run start
   ```

   This command will start both the frontend and backend servers concurrently.

6. Open your browser and visit `http://localhost:8080` to view the application.

## Usage

1. On the home page, click "Start Age Verification" to begin the process.
2. Upload an ID document (image or PDF) of the person being verified.
3. Use the webcam to capture a live image of the person.
4. Enter the person's birth date.
5. Click "Verify Age" to process the information.
6. The system will compare the ID photo with the live image and calculate the person's age.
7. Results will be displayed, indicating whether the person's age is verified and if they meet the required age threshold.

## Service Description

AgeCheck Spotter provides a seamless and accurate age verification service by combining document analysis, facial recognition, and date of birth verification. The process works as follows:

1. Document Upload: The system accepts various forms of identification, including driver's licenses, passports, and national ID cards.

2. Face Capture: Using the device's camera, a live image of the person is captured for comparison with the ID document.

3. Data Processing: The backend service extracts information from the ID document, including the photo and date of birth.

4. Face Comparison: Advanced facial recognition algorithms compare the ID photo with the live capture to ensure they match.

5. Age Calculation: The system calculates the person's age based on the provided date of birth.

6. Verification Result: A comprehensive result is returned, indicating whether the age is verified and if the person meets the required age threshold.

This service helps businesses maintain compliance with age restriction laws while providing a quick and non-intrusive verification process for customers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or support, please contact the project maintainers at support@agecheckspotter.com.

---

This project was initially generated with [GPT Engineer](https://gptengineer.app) and further improved. You can visit the project page [here](https://gptengineer.app/projects/6f6cd390-03bf-4851-85d8-065480b1bf8b/improve).