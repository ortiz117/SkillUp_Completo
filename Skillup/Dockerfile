FROM nginx:stable-alpine

# Copia todos tus archivos (HTML, CSS, JS, imágenes, etc.) 
# a la carpeta desde donde Nginx sirve el contenido.
COPY . /usr/share/nginx/html

# Expone el puerto 80 (el puerto por defecto de Nginx)
EXPOSE 80

# El comando para iniciar Nginx (ya viene por defecto, pero es bueno ser explícito)
CMD ["nginx", "-g", "daemon off;"]