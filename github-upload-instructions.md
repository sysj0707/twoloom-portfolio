# GitHub 업로드 명령어

터미널에서 다음 명령어를 실행하세요:

## 방법 1: Personal Access Token 사용
```bash
cd /Users/yeol/dev/twoloom/portfolio_app
git push https://[YOUR_GITHUB_TOKEN]@github.com/sysj0707/twoloom-portfolio.git main
```

## 방법 2: GitHub CLI 사용 (추천)
```bash
# GitHub CLI 설치 (Homebrew)
brew install gh

# GitHub 로그인
gh auth login

# 저장소 업로드
gh repo create twoloom-portfolio --public --source=. --push
```

## 방법 3: 수동 업로드
1. 현재 프로젝트 폴더 전체를 ZIP으로 압축
2. GitHub 웹사이트에서 "Upload files" 사용
3. ZIP 파일 업로드

업로드 완료 후 Vercel 배포를 진행합니다.