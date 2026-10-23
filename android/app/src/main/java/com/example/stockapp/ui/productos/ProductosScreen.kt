package com.example.stockapp.ui.productos

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.stockapp.R
import com.example.stockapp.data.model.Producto
import com.example.stockapp.data.model.Usuario
import com.example.stockapp.data.network.Client
import kotlinx.coroutines.launch

@Composable
fun ProductosScreen(
    usuario: Usuario,
    onCerrarSesion: () -> Unit
) {
    var productos by remember { mutableStateOf<List<Producto>>(emptyList()) }
    var mensaje by remember { mutableStateOf("") }

    val scope = rememberCoroutineScope()

    //Carga los  productos automaticamente  al entrar
    LaunchedEffect(Unit) {
        try {
            productos = Client.api.getProductos()

        } catch (e: Exception) {
            mensaje = "Error al cargar los  productos"
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A2A4A))
    ) {

        //Cabecera con titulo y logo
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(id = R.drawable.logo),
                contentDescription = "Logo",
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
            )

            Spacer(modifier = Modifier.width(10.dp))

            //Para titulo
            Column {
                Text(
                    text = "StockApp",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Gestión de inventario",
                    fontSize = 11.sp,
                    color = Color(0xFFB0BEC5)
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            //Texto saludar
            Text(
                text = "Hola, ${usuario.nombre}",
                fontSize = 12.sp,
                color = Color(0xFFB0BEC5)
            )
        }

        //Linea separadora
        Spacer(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(Color(0xFF2D5AA0))
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {

            Text(
                text = "Productos",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFFB0BEC5),
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            )

            Button(
                onClick = { onCerrarSesion() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFB71C1C)
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = "Cerrar sesión",
                    fontSize = 12.sp,
                    color = Color.White
                )
            }
        }

            if (mensaje.isNotEmpty()) {
                Text(
                    text = mensaje,
                    color = Color(0xFFEF9A9A),
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            LazyColumn(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
            ) {
                items(productos) { producto ->
                    val stockBajo = producto.stockActual < producto.stockMinimo
                    val colorFondo = if (stockBajo) Color(0xFFFFEBEE) else Color(0xFFF5F5F5)
                    val colorTextoStock = if (stockBajo) Color.Red else Color(0xFF2E7D32)
                    val colorTexto = if (stockBajo) Color(0xFF8B0000) else Color(0xFF1A2A4A)

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        colors = CardDefaults.cardColors(containerColor = colorFondo)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = producto.nombre,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = colorTexto
                                )

                                Text(
                                    text = "Categoria: ${producto.categoria.nombre}",
                                    fontSize = 13.sp,
                                    color = colorTexto
                                )

                                Text(
                                    text = "Precio: ${producto.precio}€",
                                    fontSize = 13.sp,
                                    color = colorTexto
                                )

                                Text(
                                    text = "Stock: ${producto.stockActual}",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = colorTextoStock
                                )
                            }

                            Button(
                                onClick = {
                                    scope.launch {
                                        try {
                                            Client.api.registrarVenta(producto.id, usuario.id)
                                            productos = Client.api.getProductos()
                                        } catch (e: Exception) {
                                            mensaje = "Error al registrar la venta"
                                        }
                                    }
                                }
                            ) {
                                Text("Vender", color = Color.White)
                            }
                        }

                    }

                }

            }


        }

    }

