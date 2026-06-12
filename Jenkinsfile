pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        // ============================================================
        // STAGE DE TESTES — Guilherme Ribeiro (Frontend)
        // Atende critério 4: 1 job por integrante, comitado pelo próprio
        // Gera: JUnit XML (para Jenkins exibir trend) + HTML (para anexar em e-mail)
        // ============================================================
        stage('Relatório de Testes Frontend - Guilherme') {
            steps {
                sh 'mkdir -p test-results'
                // Roda os 30 testes Vitest e gera o JUnit XML
                sh 'npm run test:ci'
                // Converte o XML em um relatório HTML self-contained
                sh 'npm run test:report'
            }
            post {
                always {
                    // Mostra resultados na aba "Test Result" do Jenkins (plugin JUnit)
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'

                    // Salva os relatórios como artifacts da build —
                    // ficam disponíveis pra download e pra anexar em email
                    archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

                    // -------------------------------------------------------------
                    // ENVIO POR EMAIL (a ser ativado quando o SMTP do Jenkins for
                    // configurado). Requer o plugin "Email Extension" instalado e
                    // SMTP em "Manage Jenkins > Configure System > Extended E-mail
                    // Notification". Quando pronto, basta descomentar o bloco abaixo.
                    // -------------------------------------------------------------
                    //
                    // emailext(
                    //     subject: "[Duck Frontend] Testes - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                    //     mimeType: 'text/html',
                    //     body: """
                    //         <h2>Relatório de Testes — Duck Frontend</h2>
                    //         <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                    //         <p><b>Status:</b> ${currentBuild.currentResult}</p>
                    //         <p><b>Branch:</b> ${env.GIT_BRANCH ?: 'main'}</p>
                    //         <p>Relatório HTML em anexo — abra para ver o detalhamento dos 30 testes.</p>
                    //     """,
                    //     attachmentsPattern: 'test-results/index.html, test-results/junit.xml',
                    //     to: 'guilhermefribeiro41@gmail.com'
                    // )
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker build -t c214-frontend .'
                sh 'docker stop frontend || true'
                sh 'docker rm frontend || true'
                sh 'docker run -d --name frontend -p 5173:5173 c214-frontend'
            }
        }
    }

    post {
        success {
            echo 'Testes e deploy concluidos com sucesso!'
        }
        failure {
            echo 'Algum passo falhou. Verifique os logs acima.'
        }
    }
}
