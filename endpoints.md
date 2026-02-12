# Documentação da API Pizzaria Backend

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users` | Cria um novo usuário. |
| `POST` | `/session` | Autentica um usuário e cria uma sessão. |
| `GET` | `/me` | Obtém os detalhes do usuário autenticado. |
| `POST` | `/category` | Cria uma nova categoria de produto. |
| `GET` | `/category` | Lista todas as categorias de produtos. |
| `POST` | `/product` | Cria um novo produto. |
| `GET` | `/products` | Lista todos os produtos. |
| `DELETE` | `/product` | Desabilita um produto. |
| `GET` | `/category/product` | Lista produtos por categoria. |
| `POST` | `/order` | Cria um novo pedido. |
| `GET` | `/orders` | Lista todos os pedidos. |
| `POST` | `/order/add` | Adiciona um item a um pedido existente. |
| `DELETE` | `/order/remove` | Remove um item de um pedido. |
| `GET` | `/order/detail` | Obtém os detalhes de um pedido específico. |
| `PUT` | `/order/send` | Envia um pedido, marcando-o como não rascunho. |
| `PUT` | `/order/finish` | Finaliza um pedido, marcando seu status como concluído. |
| `DELETE` | `/order` | Exclui um pedido. |

---

## Detalhes dos Endpoints

### `POST /users`

Cria um novo usuário no sistema.

**Corpo da Requisição (JSON)**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Resposta de Sucesso (Status 201)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "role": "string",
  "createdAt": "Date"
}
```

### `POST /session`

Autentica um usuário existente e retorna um token de acesso.

**Corpo da Requisição (JSON)**

```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta de Sucesso (Status 200)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### `GET /me`

Retorna os detalhes do usuário atualmente autenticado. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "role": "string",
  "createdAt": "Date"
}
```

### `POST /category`

Cria uma nova categoria de produto. Requer autenticação JWT e permissão de administrador.

**Corpo da Requisição (JSON)**

```json
{
  "name": "string"
}
```

**Resposta de Sucesso (Status 201)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "createdAt": "Date"
}
```

### `GET /category`

Lista todas as categorias de produtos. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "createdAt": "Date"
  }
]
```

### `POST /product`

Cria um novo produto. Requer autenticação JWT, permissão de administrador e envio de imagem (`file`).

**Corpo da Requisição (form-data)**

```
name: string
price: string (número)
description: string
category_id: string (UUID)
file: File (imagem)
```

**Resposta de Sucesso (Status 200)**

```json
{
  "name": "string",
  "price": "number",
  "description": "string",
  "category_id": "string (UUID)",
  "banner": "string (URL da imagem)",
  "createdAt": "Date",
  "id": "string (UUID)"
}
```

### `GET /products`

Lista todos os produtos com a opção de filtrar por produtos desabilitados. Requer autenticação JWT.

**Parâmetros de Query**

`disabled`: `boolean` (opcional, padrão `false`). Ex: `/products?disabled=true`

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "price": "number",
    "description": "string",
    "banner": "string (URL da imagem)",
    "disabled": "boolean",
    "category_id": "string (UUID)",
    "createdAt": "Date",
    "category": {
      "id": "string (UUID)",
      "name": "string"
    }
  }
]
```

### `DELETE /product`

Desabilita um produto, tornando-o indisponível. Requer autenticação JWT e permissão de administrador.

**Parâmetros de Query**

`product_id`: `string` (UUID do produto a ser desabilitado)

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
{
  "message": "Product successfully disabled"
}
```

### `GET /category/product`

Lista produtos pertencentes a uma categoria específica. Requer autenticação JWT.

**Parâmetros de Query**

`category_id`: `string` (UUID da categoria)

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "price": "number",
    "description": "string",
    "banner": "string (URL da imagem)",
    "disabled": "boolean",
    "category_id": "string (UUID)",
    "createdAt": "Date",
    "category": {
      "id": "string (UUID)",
      "name": "string"
    }
  }
]
```

### `POST /order`

Cria um novo pedido. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

```json
{
  "table": "number (inteiro positivo)",
  "name": "string (opcional)"
}
```

**Resposta de Sucesso (Status 201)**

```json
{
  "id": "string (UUID)",
  "table": "number",
  "name": "string",
  "status": "boolean",
  "draft": "boolean",
  "createdAt": "Date"
}
```

### `GET /orders`

Lista todos os pedidos, com opção de filtrar por rascunhos. Requer autenticação JWT.

**Parâmetros de Query**

`draft`: `boolean` (opcional, padrão `false`). Ex: `/orders?draft=true`

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "table": "number",
    "status": "boolean",
    "draft": "boolean",
    "createdAt": "Date",
    "items": [
      {
        "id": "string (UUID)",
        "amount": "number",
        "product": {
          "id": "string (UUID)",
          "name": "string",
          "price": "number",
          "description": "string",
          "banner": "string (URL da imagem)"
        }
      }
    ]
  }
]
```

### `POST /order/add`

Adiciona um item a um pedido existente. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

```json
{
  "order_id": "string (UUID)",
  "product_id": "string (UUID)",
  "amount": "number (inteiro positivo)"
}
```

**Resposta de Sucesso (Status 200)**

```json
{
  "amount": "number",
  "id": "string (UUID)",
  "order_id": "string (UUID)",
  "product_id": "string (UUID)",
  "createdAt": "Date",
  "product": {
    "id": "string (UUID)",
    "name": "string",
    "price": "number",
    "description": "string",
    "banner": "string (URL da imagem)"
  }
}
```

### `DELETE /order/remove`

Remove um item de um pedido existente. Requer autenticação JWT.

**Parâmetros de Query**

`item_id`: `string` (UUID do item a ser removido)

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
{
  "message": "Item successfully deleted"
}
```

### `GET /order/detail`

Obtém os detalhes de um pedido específico, incluindo todos os seus itens. Requer autenticação JWT.

**Parâmetros de Query**

`order_id`: `string` (UUID do pedido)

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
{
  "table": "number",
  "name": "string",
  "id": "string (UUID)",
  "status": "boolean",
  "draft": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "items": [
    {
      "id": "string (UUID)",
      "amount": "number",
      "createdAt": "Date",
      "product": {
        "id": "string (UUID)",
        "name": "string",
        "price": "number",
        "description": "string",
        "banner": "string (URL da imagem)"
      }
    }
  ]
}
```

### `PUT /order/send`

Envia um pedido, alterando seu status de rascunho para `false` e, opcionalmente, definindo um nome. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

```json
{
  "order_id": "string (UUID)",
  "name": "string (opcional)"
}
```

**Resposta de Sucesso (Status 200)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "table": "number",
  "draft": "boolean",
  "status": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `PUT /order/finish`

Finaliza um pedido, marcando seu status como `true`. Requer autenticação JWT.

**Corpo da Requisição (JSON)**

```json
{
  "order_id": "string (UUID)"
}
```

**Resposta de Sucesso (Status 200)**

```json
{
  "id": "string (UUID)",
  "name": "string",
  "table": "number",
  "draft": "boolean",
  "status": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `DELETE /order`

Exclui um pedido do sistema. Requer autenticação JWT.

**Parâmetros de Query**

`order_id`: `string` (UUID do pedido a ser excluído)

**Corpo da Requisição (JSON)**

Nenhum

**Resposta de Sucesso (Status 200)**

```json
{
  "message": "Order successfully deleted"
}
```

## 📅 Última Atualização

**Data**: 30 de janeiro de 2026

---

## 👥 Contribuição

Este documento deve ser atualizado sempre que houver mudanças significativas na arquitetura, endpoints, ou estrutura do projeto.