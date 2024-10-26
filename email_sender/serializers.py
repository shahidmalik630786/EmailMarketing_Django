from rest_framework import serializers
from .models import Project, Settings, Emails, Hardblacklist, Generalwords, Erledigt


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'absender_name', 'absender_firma', 'absender_email', 'smtp_email', 'send_start_hour', 'send_end_hour']


class SettingsSerializerUpdate(serializers.ModelSerializer):
    absender_telefon = serializers.CharField(required=False, allow_blank=True)  # Make absender_telefon optional
    bcc_email_1 = serializers.EmailField(required=False, allow_blank=True)  # Make bcc_email_1 optional
    bcc_email_2 = serializers.EmailField(required=False, allow_blank=True)  # Make bcc_email_2 optional

    class Meta:
        model = Settings
        fields = ['absender_name', 'absender_firma', 'absender_strasse', 'absender_plz', 
            'absender_telefon', 'absender_email', 'smtp_email', 'smtp_name', 
            # 'smtp_password', 
            'smtp_server', 'smtp_port', 'arbeitsaufgabe', 'betreff_aufgabe', 'token_limit', 
            # 'api_key', 
            'absender_homepage', 'bcc_email_1', 'bcc_email_2', 'wait_time', 'send_start_hour', 
            'send_end_hour', 'max_workers', 'debug', 'projekt_id', 'ssl_tls'
        ]


class SettingsSerializerdata(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'absender_name', 'projekt_id']


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emails
        fields = ["id", "email", "projekt_id", "ceo_name", "domain"]


class HardblacklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hardblacklist
        fields = ["id", "domain", "projekt_id"]


class GeneralwordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Generalwords
        fields = ["id", "word"]

class ErledigtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Erledigt
        fields = ['id', 'domain', 'ceo_name', 'email_text', 'projekt_id', 'timestamp']  