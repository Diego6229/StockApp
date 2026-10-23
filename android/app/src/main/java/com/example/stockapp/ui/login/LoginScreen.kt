package com.example.stockapp.ui.login

import android.widget.Space
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.stockapp.R
import com.example.stockapp.data.model.Usuario
import com.example.stockapp.data.network.Client
import kotlinx.coroutines.launch

////Colores de la  pagina
//private val AzulOscuro = Color(0xFF1A2A4A)
//private val AzulMedio = Color(0xFF1E3A6E)
//private val AzulBoton = Color(0xFF2D5AA0)
//private val Blanco = Color.White
//private val BlancoSuave = Color(0xFFE8EEF7)
//private val Gris = Color(0xFFB0BEC5)

@Composable
fun LoginScreen(
    onLoginCorrecto: (Usuario) -> Unit
){
    var nombre by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var mensaje by remember { mutableStateOf("") }
    var cargando by remember { mutableStateOf(false) }

    //Para llamara la api
    val  scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A2A4A))
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        //Logo
        Image(
            painter = painterResource(id = R.drawable.logo),
            contentDescription = "Logo StockApp",
            modifier = Modifier
                .size(110.dp)
                .clip(RoundedCornerShape(24.dp))
        )

            Spacer(modifier = Modifier.height(20.dp))

            //Titulo
            Text(
            text = "StockApp",
            fontSize = 36.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
            )

            //Subtitulo
            Text(
                text = "Sistema de gestión de inventario",
                fontSize = 13.sp,
                color = Color(0xFFB0BEC5)
            )

            Spacer(modifier = Modifier.height(40.dp))



                Text(
                    text = "Bienvenido a StockApp",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Text(
                    text = "Inicia sesión para continuar",
                    fontSize = 12.sp,
                    color = Color(0xFFB0BEC5)
                )

                Spacer(modifier = Modifier.height(24.dp))

                //Campo usuario
                OutlinedTextField(
                    value = nombre,
                    onValueChange = { nombre = it },
                    label = { Text("Usuario",color = Color(0xFFB0BEC5)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF2D5AA0),
                        unfocusedBorderColor = Color(0xFFB0BEC5),

                    )
                )
                Spacer(modifier = Modifier.height(12.dp))


                //Campo  contraseña
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña", color = Color(0xFFB0BEC5)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF2D5AA0),
                        unfocusedBorderColor = Color(0xFFB0BEC5)
                    )
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        if (nombre.isNotBlank() && password.isNotBlank()) {
                            cargando = true
                            mensaje = ""
                            //Lanza  la corountine al pulsar el boton
                            scope.launch {
                                try {
                                    val usuario = Client.api.login(nombre, password)
                                    if (usuario != null) {
                                        onLoginCorrecto(usuario)
                                    } else {
                                        mensaje = "Credenciales incorrectas."
                                    }

                                } catch (e: java.io.EOFException) {
                                    // El servidor devuelve vacío y escribe "credenciales incorrectas"
                                    mensaje = "Credenciales incorrectas"

                                } catch (e: Exception) {
                                    mensaje = "Error al conectar con el servidor"
                                }finally {
                                    cargando = false
                                }
                            }
                        } else {
                            mensaje = "Obligatorio rellenar todos los campos"
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    enabled = !cargando,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF2D5AA0)
                    )
                ) {
                    Text(
                        text = if (cargando) "Conectando..." else "Iniciar sesión",
                        fontSize = 16.sp,

                    )

                }

                Spacer(modifier = Modifier.height(12.dp))


                if (mensaje.isNotEmpty()) {
                    Text(
                        text = mensaje,
                        color = Color(0xFFEF9A9A)

                    )
                }
            }


}