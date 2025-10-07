pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  parameters {
    string(name: 'IMAGE_NAME', defaultValue: 'yourdockerhubusername/student-marks-grade', description: 'Docker image name to build/push')
    string(name: 'REGISTRY_CREDENTIALS', defaultValue: 'dockerhub-credentials', description: 'Jenkins credentials id (username/password) for Docker Hub')
    booleanParam(name: 'PUSH_TO_REGISTRY', defaultValue: false, description: 'If true, push the built image to Docker Hub')
  }

  environment {
    BACKEND_DIR = 'backend'
    BUILD_TAG = "${env.BUILD_NUMBER ?: 'local'}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        dir(env.BACKEND_DIR) {
          sh 'npm ci --no-audit --no-fund'
        }
      }
    }

    stage('Syntax check') {
      steps {
        sh 'node --check ${BACKEND_DIR}/index.js'
      }
    }

    stage('Build Docker image') {
      steps {
        script {
          def image = "${params.IMAGE_NAME}:${BUILD_TAG}"
          sh "docker build -t ${image} ."
          sh "docker tag ${image} ${params.IMAGE_NAME}:latest"
          env.BUILT_IMAGE = image
        }
      }
    }

    stage('Push to registry') {
      when {
        expression { return params.PUSH_TO_REGISTRY == true }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${params.IMAGE_NAME}:${BUILD_TAG}"
          sh "docker push ${params.IMAGE_NAME}:latest"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline finished successfully. Built image: ${params.IMAGE_NAME}:${BUILD_TAG}"
    }
    failure {
      echo 'Pipeline failed.'
    }
    always {
      cleanWs()
    }
  }
}
