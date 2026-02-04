from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Reserva
from .serializers import ReservaSerializer, HorarioOcupadoSerializer
import random
from datetime import datetime, timedelta

def generar_codigo():
    return ''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=6))

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all().order_by("-created_at")
    serializer_class = ReservaSerializer

    # -------------------------------
    # PERMISOS POR ACCIÓN
    # -------------------------------
    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]           # Crear → usuario logueado
        if self.action in ["list", "retrieve"]:
            return [IsAdminUser()]               # Listar / detalle → solo admin
        if self.action in ["cancelar", "ocupadas"]:
            return [AllowAny()]                  # Cancelar y ver horarios ocupados → público
        if self.action == "mis_reservas":
            return [IsAuthenticated()]           # Mis reservas → usuario logueado
        return [IsAuthenticated()]               # Resto de acciones → usuario logueado

    # -------------------------------
    # CREAR RESERVA CON VALIDACIÓN
    # -------------------------------
    def perform_create(self, serializer):
        fecha = serializer.validated_data['fecha']
        hora_inicio = serializer.validated_data['hora_inicio']
        hora_fin = serializer.validated_data['hora_fin']

        margen = timedelta(minutes=10)
        inicio_nuevo = datetime.combine(fecha, hora_inicio)
        fin_nuevo = datetime.combine(fecha, hora_fin)

        # Solo considerar reservas confirmadas para evitar solapamientos
        conflicto = Reserva.objects.filter(
            fecha=fecha,
            estado='confirmada',
            hora_inicio__lt=(fin_nuevo + margen).time(),
            hora_fin__gt=(inicio_nuevo - margen).time()
        ).exists()

        if conflicto:
            raise ValidationError({"non_field_errors": ["Ya existe una reserva en ese horario."]})

        # Guardar reserva asignando usuario logueado
        serializer.save(
            codigo_cancelacion=generar_codigo(),
            estado='confirmada',
            usuario=self.request.user,       # <-- clave para que el perfil funcione
            nombre=self.request.user.username  # opcional para mostrar en cronograma
        )

    # -------------------------------
    # CANCELAR RESERVA
    # -------------------------------
    @action(detail=False, methods=["post"])
    def cancelar(self, request):
        codigo = request.data.get("codigo")
        if not codigo:
            return Response({"error": "Se requiere el código de cancelación"}, status=400)

        try:
            reserva = Reserva.objects.get(codigo_cancelacion=codigo, estado="confirmada")
        except Reserva.DoesNotExist:
            return Response({"error": "Código inválido o reserva ya cancelada"}, status=400)

        reserva.estado = "cancelada"
        reserva.save()
        return Response({"mensaje": "Reserva cancelada correctamente. El horario quedó libre."})

    # -------------------------------
    # HORARIOS OCUPADOS (PÚBLICO)
    # -------------------------------
    @action(detail=False, methods=["get"])
    def ocupadas(self, request):
        reservas = Reserva.objects.filter(estado="confirmada")
        serializer = HorarioOcupadoSerializer(reservas, many=True)
        return Response(serializer.data)

    # -------------------------------
    # RESERVAS DEL USUARIO LOGUEADO
    # -------------------------------
    @action(detail=False, methods=["get"])
    def mis_reservas(self, request):
        reservas = Reserva.objects.filter(estado="confirmada", usuario=request.user)
        serializer = ReservaSerializer(reservas, many=True)
        return Response(serializer.data)
