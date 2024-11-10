from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AgeBracket(models.Model):
    age = models.IntegerField()

    def __str__(self):
        return f"{self.age}"


class InsurancePremium(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    age_bracket = models.ForeignKey(AgeBracket, on_delete=models.CASCADE)
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.company.name} - Age: {self.age_bracket.age} - Premium: {self.premium_amount}"
