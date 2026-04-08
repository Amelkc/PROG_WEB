from rest_framework import serializers
from .models import *

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
    def validate(self, data):
        instance = Event(**data)
        if self.instance:
            instance.pk = self.instance.pk
        try:
            instance.clean()
        except Exception as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, "message_dict") else str(e))
        return data
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)#si password modifié
        instance.full_clean()
        instance.save()
        return instance
            


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["id", "first_name", "last_name", "email"]
        read_only_fields = ["id"]
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = Participant(**validated_data)
        if password:
            user.set_password(password)  # hashes it properly
        user.full_clean()
        user.save()
        return user


class RegistrationSerializer(serializers.ModelSerializer):
    participant_detail = ParticipantSerializer(source="participant", read_only=True)
    class Meta:
        model = Registration
        fields = "__all__"
    def validate(self, data):
        instance = Registration(**data)
        if self.instance:
            instance.pk = self.instance.pk
        try:
            instance.clean()
        except Exception as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, "message_dict") else str(e))
        return data