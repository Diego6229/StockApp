package com.example.stockapp.data.network

import com.example.stockapp.data.model.Producto
import com.example.stockapp.data.model.Usuario
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

//Para declarar los endpoints
interface StockApi {
    @POST("api/login")
    suspend fun login(
        @Query("nombre") nombre: String,
        @Query("password") password: String
    ): Usuario?

    @GET("api/productos")
    suspend fun getProductos(): List<Producto>

    @POST("api/venta/{idProducto}")
    suspend fun registrarVenta(
        @Path("idProducto") idProducto: Long,
        @Query("idUsuario") idUsuario: Long
    )
}