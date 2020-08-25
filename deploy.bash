cd /root/Fitness-Planner/backend
git stash
git pull

npm config set ignore-scripts true
npm i
npm config set ignore-scripts false

npm run build

pm2 restart 1