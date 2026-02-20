from rest_framework import serializers
from .models import Reserva

class ReservaSerializer(serializers.ModelSerializer):
    codigo_cancelacion = serializers.CharField(read_only=True)
    estado = serializers.CharField(read_only=True)

    class Meta:
        model = Reserva
        fields = "__all__"

    def validate(self, data):
        fecha = data.get("fecha")
        hora_inicio = data.get("hora_inicio")
        hora_fin = data.get("hora_fin")

        if hora_inicio >= hora_fin:
            raise serializers.ValidationError("La hora de inicio debe ser menor que la hora de fin.")

        reservas = Reserva.objects.filter(
            fecha=fecha,
            estado="confirmada",
            hora_inicio__lt=hora_fin,
            hora_fin__gt=hora_inicio
        )

        if self.instance:
            reservas = reservas.exclude(id=self.instance.id)

        if reservas.exists():
            raise serializers.ValidationError("Ya existe una reserva para ese día y horario.")

        return data

class HorarioOcupadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ['fecha', 'hora_inicio', 'hora_fin']

