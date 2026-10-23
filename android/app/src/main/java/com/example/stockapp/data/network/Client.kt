package com.example.stockapp.data.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

//Solo  puede existir una vez
object Client {
    private const val BASE_URL = "http://10.0.2.2:8080/"

    val api: StockApi by lazy{
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(StockApi::class.java)
    }
}