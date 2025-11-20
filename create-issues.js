#!/usr/bin/env node

/**
 * Skript zum automatischen Erstellen von GitHub Issues aus issues-to-create.json
 * 
 * Verwendung:
 * 1. GitHub Personal Access Token mit 'repo' Berechtigung erstellen
 * 2. Token als Umgebungsvariable setzen: export GITHUB_TOKEN="dein_token"
 * 3. Skript ausführen: node create-issues.js
 * 
 * Alternativ: Token direkt als Argument übergeben
 * node create-issues.js YOUR_GITHUB_TOKEN
 */

const fs = require('fs');
const https = require('https');

// Konfiguration
const REPO_OWNER = 'needful-apps';
const REPO_NAME = 'stuttgart-26';
const ISSUES_FILE = './issues-to-create.json';

// GitHub Token aus Umgebungsvariable oder Command Line Argument
const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ Fehler: Kein GitHub Token gefunden!');
    console.error('');
    console.error('Verwende eine der folgenden Methoden:');
    console.error('  1. Umgebungsvariable: export GITHUB_TOKEN="dein_token"');
    console.error('  2. Command Line Argument: node create-issues.js YOUR_TOKEN');
    console.error('');
    console.error('Erstelle einen Token unter: https://github.com/settings/tokens');
    console.error('Erforderliche Berechtigung: repo');
    process.exit(1);
}

// Issues aus JSON-Datei laden
let issues;
try {
    const issuesData = fs.readFileSync(ISSUES_FILE, 'utf8');
    issues = JSON.parse(issuesData);
    console.log(`✅ ${issues.length} Issues aus ${ISSUES_FILE} geladen`);
} catch (error) {
    console.error(`❌ Fehler beim Laden der Issues: ${error.message}`);
    process.exit(1);
}

/**
 * Erstellt ein einzelnes GitHub Issue
 */
function createGitHubIssue(issue) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            title: issue.title,
            body: issue.body,
            labels: issue.labels || []
        });

        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
            method: 'POST',
            headers: {
                'User-Agent': 'Node.js GitHub Issues Creator',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 201) {
                    const createdIssue = JSON.parse(responseData);
                    resolve(createdIssue);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

/**
 * Pause zwischen Requests (Rate Limiting beachten)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hauptfunktion: Alle Issues erstellen
 */
async function createAllIssues() {
    console.log('');
    console.log('🚀 Starte Issue-Erstellung...');
    console.log('');

    const results = {
        success: [],
        failed: []
    };

    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        const issueNumber = i + 1;
        
        try {
            console.log(`[${issueNumber}/${issues.length}] Erstelle: ${issue.title.substring(0, 60)}...`);
            
            const createdIssue = await createGitHubIssue(issue);
            results.success.push({
                title: issue.title,
                number: createdIssue.number,
                url: createdIssue.html_url
            });
            
            console.log(`   ✅ Erstellt als Issue #${createdIssue.number}`);
            console.log(`   🔗 ${createdIssue.html_url}`);
            
            // Pause zwischen Requests (GitHub Rate Limiting: max 5000/hour)
            if (i < issues.length - 1) {
                await sleep(1000); // 1 Sekunde Pause
            }
        } catch (error) {
            results.failed.push({
                title: issue.title,
                error: error.message
            });
            console.error(`   ❌ Fehler: ${error.message}`);
        }
        
        console.log('');
    }

    // Zusammenfassung
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 ZUSAMMENFASSUNG');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Erfolgreich erstellt: ${results.success.length}/${issues.length}`);
    console.log(`❌ Fehlgeschlagen: ${results.failed.length}/${issues.length}`);
    console.log('');

    if (results.success.length > 0) {
        console.log('✅ ERFOLGREICH ERSTELLTE ISSUES:');
        results.success.forEach(result => {
            console.log(`   #${result.number}: ${result.title}`);
            console.log(`   🔗 ${result.url}`);
        });
        console.log('');
    }

    if (results.failed.length > 0) {
        console.log('❌ FEHLGESCHLAGENE ISSUES:');
        results.failed.forEach(result => {
            console.log(`   - ${result.title}`);
            console.log(`     Fehler: ${result.error}`);
        });
        console.log('');
    }

    // Ergebnisse in Datei speichern
    const resultsFile = 'issues-creation-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`💾 Detaillierte Ergebnisse gespeichert in: ${resultsFile}`);
    console.log('');

    if (results.failed.length > 0) {
        process.exit(1);
    }
}

// Script starten
createAllIssues().catch(error => {
    console.error('❌ Kritischer Fehler:', error);
    process.exit(1);
});
