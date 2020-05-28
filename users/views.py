from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, logout as auth_logout, login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserRegisterForm

# Create your views here.
def register(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect(reverse('index'))

	if request.method == 'POST':
		form = UserRegisterForm(request.POST)
		if form.is_valid():
			form.save()
			return HttpResponseRedirect(reverse('login'))
	else:
		form = UserRegisterForm()

	return render(request, 'users/register.html', {'form': form})


def login(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect(reverse('index'))

	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(request, username=username, password=password)
		if user is not None:
			auth_login(request, user)
			return HttpResponseRedirect(reverse('index'))
		
	form = AuthenticationForm()
	return render(request, 'users/login.html', {'form': form})


def logout(request):
	auth_logout(request)
	return HttpResponseRedirect(reverse('login'))