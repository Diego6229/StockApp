package com.example.stockapp.data.model

data class Producto(
    val id: Long,
    val nombre: String,
    val precio: Double,
    val stockActual: Int,
    val stockMinimo: Int,
    val categoria: Categoria
)

data class Categoria(
    val id: Long,
    val nombre: String
)