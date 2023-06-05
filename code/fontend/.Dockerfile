# 基础镜像
FROM node:12.16.1-alpine as build

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到镜像中
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝所有文件到工作目录
COPY . .

# 运行构建脚本
RUN npm run build

# 静态资源 nginx 服务器
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/did.key /etc/ssl/certs/did.key
COPY nginx/did.crt /etc/ssl/certs/did.crt
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
