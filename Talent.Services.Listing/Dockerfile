#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY ["Talent.Services.Listing/Talent.Services.Talent.csproj", "Talent.Services.Listing/"]
COPY ["Talent.Common/Talent.Common.csproj", "Talent.Common/"]
COPY ["Talent.Services.Profile/Talent.Services.Profile.csproj", "Talent.Services.Profile/"]
RUN dotnet restore "Talent.Services.Listing/Talent.Services.Talent.csproj"
COPY . .
WORKDIR "/src/Talent.Services.Listing"
RUN dotnet build "Talent.Services.Talent.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Talent.Services.Talent.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Talent.Services.Talent.dll"]