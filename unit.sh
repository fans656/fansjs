if [ $# -eq 0 ]; then
  npm run unit
else
  npm run unit -- --testNamePattern "$1"
fi
