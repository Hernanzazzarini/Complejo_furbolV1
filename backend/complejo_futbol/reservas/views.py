from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser  # 👈 NUEVO
from .models import Reserva
from .serializers import ReservaSerializer
import random
from datetime import datetime, timedelta


def generar_codigo():
    return ''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=6))


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all().order_by("-created_at")
    serializer_class = ReservaSerializer

    # 👇 PERMISOS (no rompe nada)
    def get_permissions(self):
        # crear reserva
        if self.action == "create":
            return [IsAuthenticated()]

        # listar reservas (ReservasAdmin.jsx)
        if self.action in ["list", "retrieve"]:
            return [IsAdminUser()]

        # cancelar reserva → público (como lo tenías)
        if self.action == "cancelar":
            return []

        return super().get_permissions()

    def perform_create(self, serializer):
        fecha = serializer.validated_data['fecha']
        hora_inicio = serializer.validated_data['hora_inicio']
        hora_fin = serializer.validated_data['hora_fin']

        margen = timedelta(minutes=10)

        inicio_nuevo = datetime.combine(fecha, hora_inicio)
        fin_nuevo = datetime.combine(fecha, hora_fin)

        # 🔴 SOLO CONSIDERAR RESERVAS CONFIRMADAS
        conflicto = Reserva.objects.filter(
            fecha=fecha,
            estado='confirmada',
            hora_inicio__lt=(fin_nuevo + margen).time(),
            hora_fin__gt=(inicio_nuevo - margen).time()
        ).exists()

        if conflicto:
            raise ValidationError({
                "non_field_errors": ["Ya existe una reserva en ese horario."]
            })

        serializer.save(
            codigo_cancelacion=generar_codigo(),
            estado='confirmada'
        )

    @action(detail=False, methods=['post'])
    def cancelar(self, request):
        codigo = request.data.get("codigo")

        if not codigo:
            return Response(
                {"error": "Se requiere el código de cancelación"},
                status=400
            )

        try:
            reserva = Reserva.objects.get(
                codigo_cancelacion=codigo,
                estado='confirmada'
            )
        except Reserva.DoesNotExist:
            return Response(
                {"error": "Código inválido o reserva ya cancelada"},
                status=400
            )

        reserva.estado = "cancelada"
        reserva.save()

        return Response({
            "mensaje": "Reserva cancelada correctamente. El horario quedó libre."
        })
