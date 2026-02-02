from django.shortcuts import render

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Usuario ya existe"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({"message": "Usuario creado"}, status=201)

