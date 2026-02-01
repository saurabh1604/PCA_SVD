# SVD & PCA: A Visual Journey

An interactive educational application that explores the geometric intuition behind Singular Value Decomposition (SVD) and its connection to Principal Component Analysis (PCA).

## Features

- **Fundamentals:** Interactive visualizations of Variance, Covariance Matrices, and Dimensionality Reduction.
- **Geometric SVD:** A step-by-step interactive animation showing how any matrix transformation decomposes into Rotation ($V^T$), Stretch ($\Sigma$), and Rotation ($U$).
- **PCA & SVD Connection:** Mathematical proofs and a 3D interactive visualization using `react-three-fiber` to show Principal Components.
- **Modern UI:** Built with React, Tailwind CSS (Dark Mode), and Framer Motion.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (usually comes with Node.js)

## Getting Started

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in your browser**:
    Typically `http://localhost:5173/` (the terminal will show the exact URL).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.
