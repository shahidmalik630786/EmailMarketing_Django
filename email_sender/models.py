from django.db import models
from django.core.validators import EmailValidator, MinLengthValidator, MaxLengthValidator, RegexValidator, MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
import re



class Project(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "project"


# def validate_phone(value):
#     if not re.match(r'^\+?\d{9,15}$', value):
#         raise ValidationError('Phone number must be in the format: "+999999999". Up to 15 digits allowed.')

class Settings(models.Model):
    id = models.AutoField(primary_key=True) 
    absender_name = models.CharField(max_length=255)
    absender_firma = models.CharField(max_length=255)
    absender_strasse = models.CharField(max_length=255)
    absender_plz = models.CharField(max_length=20)
    absender_telefon = models.CharField(max_length=20, blank=False, null=False, validators=[RegexValidator(
                regex=r'^\+?1?\d{9,15}$',  # Example regex for international phone numbers
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )])
    absender_email = models.CharField(max_length=255, validators=[EmailValidator()])
    smtp_email = models.CharField(max_length=255, validators=[EmailValidator()])
    smtp_name = models.CharField(max_length=255)
    smtp_password = models.CharField(max_length=255)
    smtp_server = models.CharField(max_length=255)
    smtp_port = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(65535)])
    arbeitsaufgabe = models.TextField()
    betreff_aufgabe = models.TextField()
    token_limit = models.IntegerField()
    api_key = models.CharField(max_length=255)
    absender_homepage = models.CharField(max_length=255)
    bcc_email_1 = models.CharField(max_length=255, blank=False, null=False, validators=[EmailValidator()])
    bcc_email_2 = models.CharField(max_length=255, blank=False, null=False, validators=[EmailValidator()])
    wait_time = models.IntegerField(validators=[MinValueValidator(0)])
    send_start_hour = models.IntegerField(validators=[MinValueValidator(0) ,MaxValueValidator(23)])
    send_end_hour = models.IntegerField(validators=[MinValueValidator(0) ,MaxValueValidator(23)])
    max_workers = models.IntegerField()
    debug = models.IntegerField(validators=[MinValueValidator(0)])
    projekt_id = models.IntegerField(validators=[MinValueValidator(1)])
    ssl_tls = models.BooleanField(db_column='SSL/TLS')  

    class Meta:
        managed = False  
        db_table = 'settings'  


class Emails(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255, validators=[EmailValidator(message="Enter a valid email address.")], blank=False, null=False)
    projekt_id = models.IntegerField(blank=False, null=False)
    ceo_name =  models.CharField(max_length=255,
                                 validators=[
                                MinLengthValidator(2, message="CEO Name must be at least 2 characters long."),
                                MaxLengthValidator(255, message="CEO Name can't exceed 255 characters.")], blank=False, null=False)
    domain = models.CharField(max_length=255,
        validators=[
            RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
            MaxLengthValidator(255, message="Domain can't exceed 255 characters.")
        ],blank=False,  null=False,   
    )

    class Meta:
        managed = False
        db_table = 'emails'


class Hardblacklist(models.Model):
    id = models.AutoField(primary_key=True)
    domain = models.CharField(max_length=255,validators=[ RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
                     MaxLengthValidator(255, message="Domain can't exceed 255 characters.")],blank=False,  null=False)
    projekt_id = models.IntegerField(blank=False, null=False)
    
    class Meta:
        managed = False
        db_table = 'hardblacklist'


class Generalwords(models.Model):
    id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=255 ,blank=False,  null=False)
    
    class Meta:
        managed = False
        db_table = 'general_words'
        ordering = ['id']  
        indexes = [
            models.Index(fields=['id']),  
        ]


class Erledigt(models.Model):
    # id = models.AutoField(primary_key=True)
    domain = models.CharField(max_length=255,  validators=[
            RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
            MaxLengthValidator(255, message="Domain can't exceed 255 characters.")
        ])
    ceo_name = models.CharField(max_length=255)
    email_text = models.TextField()
    projekt_id = models.IntegerField()
    impressum_link = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField()
    antwort_erhalten = models.TextField(blank=True, null=True)
    antwort_timestamp = models.DateTimeField(blank=True, null=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    autodeletekeyword = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'erledigt'
        ordering = ['id']
        indexes =[
            models.Index(fields=['id'])
        ]

class Skipdomain(models.Model):
    id = models.AutoField(primary_key=True)
    domain = models.CharField(max_length=255,  validators=[
            RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
            MaxLengthValidator(255, message="Domain can't exceed 255 characters.")
        ])
    projekt_id = models.IntegerField()
    
    class Meta:
        managed = False
        db_table = 'skip_domains'
        ordering = ['projekt_id']  
        indexes = [
            models.Index(fields=['projekt_id']),  
        ]

class Fehlerhaft(models.Model):
    id = models.AutoField(primary_key=True)  
    domain = models.CharField(max_length=255, validators=[RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
                                                        MaxLengthValidator(255, message="Domain can't exceed 255 characters.")])
    projekt_id = models.IntegerField(
        validators=[MinValueValidator(1)]
    )

    class Meta:
        managed = False
        db_table = 'fehlerhaft'
        ordering = ['projekt_id']  
        indexes = [
            models.Index(fields=['projekt_id']),  
        ]


class Keywords(models.Model):
    id = models.AutoField(primary_key=True)
    keyword = models.CharField(max_length=255 ,blank=False,  null=False)
    
    class Meta:
        managed = False
        db_table = 'keywords'
        ordering = ['id']  
        indexes = [
            models.Index(fields=['id']),  
        ]

class BlacklistKeywords(models.Model):
    id = models.AutoField(primary_key=True)
    keyword = models.CharField(max_length=255 ,blank=False,  null=False)
    
    class Meta:
        managed = False
        db_table = 'blacklistkeywords'
        ordering = ['id']  
        indexes = [
            models.Index(fields=['id']),  
        ]


class ImpressumNichtGefunden(models.Model):
    id = models.AutoField(primary_key=True)
    domain = models.CharField(max_length=255, validators=[
            RegexValidator(regex=r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message="Enter a valid domain name."),
            MaxLengthValidator(255, message="Domain can't exceed 255 characters.")])
    projekt_id = models.IntegerField()
    timestamp = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'impressumnichtgefunden'
        ordering = ['id']  
        indexes = [
            models.Index(fields=['id']),  
        ]


class ParkingKeywords(models.Model):
    id = models.AutoField(primary_key=True)
    keyword = models.CharField(max_length=255 ,blank=False,  null=False)
    
    class Meta:
        managed = False
        db_table = 'parking_keywords'
        ordering = ['id']  
        indexes = [
            models.Index(fields=['id']),  
        ]