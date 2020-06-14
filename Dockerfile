FROM openjdk:8

# nodejs, zip, to unzip things
RUN apt-get update && \
  apt-get -y install zip expect && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get install -y nodejs

# Install 32bit support for Android SDK
RUN dpkg --add-architecture i386 && \
  apt-get update -q && \
  apt-get install -qy --no-install-recommends libstdc++6:i386 libgcc1:i386 zlib1g:i386 libncurses5:i386

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -y yarn

# gradle
ENV GRADLE_VERSION 5.4.1
ENV GRADLE_SDK_URL https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip
RUN curl -sSL "${GRADLE_SDK_URL}" -o gradle-${GRADLE_VERSION}-bin.zip  \
  && unzip gradle-${GRADLE_VERSION}-bin.zip -d /usr/local  \
  && rm -rf gradle-${GRADLE_VERSION}-bin.zip
ENV GRADLE_HOME /usr/local/gradle-${GRADLE_VERSION}
ENV PATH ${GRADLE_HOME}/bin:$PATH

# Setup environment
ENV ANDROID_HOME /opt/android-sdk-linux
ENV PATH ${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools
ARG ANDROID_SDK_VERSION=4333796

# android sdk tools
RUN cd /opt \
  && wget -q https://dl.google.com/android/repository/sdk-tools-linux-${ANDROID_SDK_VERSION}.zip -O tools.zip \
  && mkdir -p ${ANDROID_HOME} \
  && unzip tools.zip -d ${ANDROID_HOME} \
  && rm -f tools.zip

# sdk
RUN yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses
RUN $ANDROID_HOME/tools/bin/sdkmanager \
  tools \
  platform-tools \
  "build-tools;23.0.1" \
  "build-tools;23.0.3" \
  "build-tools;25.0.1" \
  "build-tools;25.0.2" \
  "build-tools;28.0.3" \
  "platforms;android-23" \
  "platforms;android-25" \
  "platforms;android-28" \
  "extras;android;m2repository" \
  "extras;google;m2repository" \
  "extras;google;google_play_services" \
  && $ANDROID_HOME/tools/bin/sdkmanager --update

WORKDIR /usr/src/app

COPY . ./