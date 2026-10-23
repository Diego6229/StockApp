package com.example.stockapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.stockapp.data.model.Usuario
import com.example.stockapp.ui.login.LoginScreen
import com.example.stockapp.ui.productos.ProductosScreen
import com.example.stockapp.ui.theme.StockAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            StockAppTheme {

                val navController = rememberNavController()
                //Guardar usuario que inicia sesion
                var usuarioLogueado by remember { mutableStateOf<Usuario?>(null) }

                NavHost(
                    navController =  navController,
                    startDestination = "login"
                ){
                    composable("login"){
                        LoginScreen(
                            onLoginCorrecto = { usuario ->
                                usuarioLogueado = usuario
                                navController.navigate("productos"){
                                    popUpTo("login") { inclusive =  true}
                                }
                            }
                        )
                    }

                    composable("productos"){
                        val usuario = usuarioLogueado
                        if(usuario != null){
                            ProductosScreen(
                                usuario  =  usuario,
                                onCerrarSesion = {
                                    usuarioLogueado = null
                                    navController.navigate("login"){
                                        popUpTo("productos") { inclusive=true}
                                    }
                                }
                            )
                        }
                    }
                }


            }
        }
    }
}

