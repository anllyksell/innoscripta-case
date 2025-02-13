## Installation & Setup

### 1. Clone the Repository
```sh
git clone <repository-url>
cd innoscripta-case

npm install
```

### 2. Start the Development Server
```sh
npm run dev
```

### 3. Build for Production
```sh
npm run build
```

### 4. Preview the Production Build
```sh
npm run preview
```

### 5. Docker Setup

#### Build the Docker Image
```sh
docker build -t innoscripta-case .
```

#### Run the Docker Container
```sh
docker run -p 3000:3000 innoscripta-case
```

### Stop the Docker Container
```sh
docker ps
docker stop <CONTAINER_ID>
docker rm <CONTAINER_ID>
```

## Features

- Fetch news articles from multiple sources
- Filter articles by source, category, and search term
- Responsive design for mobile and desktop

## Technologies Used

- React
- TypeScript
- Vite
- Axios (for API requests)
- Tailwind CSS (for styling)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License

This project is licensed under the MIT License.
