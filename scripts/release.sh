#!/bin/bash

VERSION=$1
DESCRIPTION=$2

if [ -z "$VERSION" ]; then
  echo "❌ Error: Proporciona una versión (ej: 1.0.0)"
  exit 1
fi

echo "🎲 Creando release v$VERSION..."

# Actualizar versiones en package.json
echo "📦 Actualizando versiones..."
cd backend && npm version $VERSION --no-git-tag-version
cd ../frontend && npm version $VERSION --no-git-tag-version
cd ../smart-contract && npm version $VERSION --no-git-tag-version
cd ..

# Commit de versiones
git add .
git commit -m "chore: bump version to v$VERSION"
git push origin main

# Crear y subir tag
git tag -a "v$VERSION" -m "${DESCRIPTION:-Release v$VERSION}"
git push origin "v$VERSION"

echo "✅ Release v$VERSION creado!"
echo "🚀 GitHub Actions se encargará del resto..."
