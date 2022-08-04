package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.DynamodbEvent;
import com.amazonaws.services.lambda.runtime.events.models.dynamodb.AttributeValue;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.awt.font.FontRenderContext;
import java.io.*;
import java.util.Map;
import java.util.Set;

public class GenerateVisuals implements RequestHandler<DynamodbEvent, String> {

    public String NEW_LINE = "\n";
    public final String DELIMITER = ",";
    @Override
    public String handleRequest(DynamodbEvent dynamodbEvent, Context context) {

        StringWriter stringWriter = new StringWriter();
        BufferedWriter fileWriter = new BufferedWriter(stringWriter);
        for (DynamodbEvent.DynamodbStreamRecord record: dynamodbEvent.getRecords()) {
            System.out.println(record.getEventID());
            System.out.println(record.getEventName());
            Map<String, AttributeValue> map = record.getDynamodb().getKeys(); // {"user_id : {N: "vikas"}"}
            Set<String> keySet = map.keySet();
            System.out.println("Keys of dynamoDb : " + keySet.toString());
            int delimiterCount = 0;
            for (String key: keySet) {
                try {
                    fileWriter.append(key);
                    delimiterCount += 1;
                    if (delimiterCount != keySet.size()) {
                        fileWriter.append(DELIMITER);
                    } else {
                        fileWriter.append(NEW_LINE);
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            } // col1, col2, col
            delimiterCount = 0;
            for (Map.Entry<String, AttributeValue> entry : map.entrySet()) {
                try {
                    fileWriter.append(entry.getValue().toString());
                    delimiterCount += 1;
                    if (delimiterCount != keySet.size()) {
                        fileWriter.append(DELIMITER);
                    } else {
                        fileWriter.append(NEW_LINE);
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                System.out.println("key : " + entry.getKey() + " value : " + entry.getValue());
            }
        }
        try {
            fileWriter.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String existingData = null;
        existingData = stringWriter.toString();
        byte[] fileArray = existingData.getBytes();
        String csvFileName = "visuals.csv";
        BlobId blobId = BlobId.of("visualization_data_proj", csvFileName);
        Credentials credentials = null;
        String creds = "{\n" +
                "  \"type\": \"service_account\",\n" +
                "  \"project_id\": \"serverlessassignemnt\",\n" +
                "  \"private_key_id\": \"03488aeeb1d69431cfffba42543ea0b178368be4\",\n" +
                "  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNgzjgK0M60O8L\\n9Ug54SDWIRDl+K5tWoDk8YHnSVJ8vB7lkQSWlCdzMWCn9wYNMEkKIPo4YI1goEwo\\nP9zRzgqw5bxOd+wjiTKJHdBkug0Ox33rywJIiVR0hty3YJCOCzv2N9XuMJNym49W\\n35V0XTvsySbBkvuL6kMcLqf9iH9mFZroKlkXcyjGMyfJJl8y80EAPYDl7rci8guv\\ntlM+mlC0DnLf+f9016a1ATA8xe61O68r5YqEpwUOaHVqracU9+1gPWmWBXUBTg+C\\nRb5uEUBY8Ksx9WyGdr0PMgKi3rIvrifLiD95EkZpXtZ4eDWmo7eVJ8BKWNjCA/QA\\nv4hRcApbAgMBAAECggEAJMaAFYE4YRyFQlcMqyrRlO/K1dRH5lKlMRLUg55Xz/Fb\\n+AmY0BdH7fGekb//Cbojv9fB3vfMJMfaiPNQoQylVh1uMn58N6mz7Nx0b6npb0Uc\\nj+a+jFtizQ1bDseNZpW1D6zTL/HqWL5kio+s72tFr2wZbtdOAy4S/0aMEi7sWUhf\\nOQuyTXSbY/SJIkBEey3/PrwEvgaUDa2IF1RKmHuB49oR4eXs/8ZVwckQvs+2WL5V\\nJp2kyE/olBoigdmFirxX9t5fB8mexwG1nC0QA1cE7Q9px2nm/1FUPtZR/EP0i5Yq\\nhgmsKDhE+oAa56S1lI/nGFBpQgNT04crYgtKO8CieQKBgQDzbjMT0HIZsc0wcoGo\\n1c/bORh10QxAA8DPoM0pLV0uWArUsn7ZLxBXfgMiSo8NZuGKZ3X/M45+TzSIomMB\\nwGSAnB/oY6sNkk+vnxFXN/M4dpSPuGeova7y6k3r5llOR9XJzNMFKFul5jr6ik62\\ni2nMCgVGNH18QeOQW4L/3YRBwwKBgQDYH82GoVLgoxXc0iHllMfstYMShjmShcl0\\nGK6OFP28DMD3/nGUaBYk8LTv/Q2sojGLPq7LyjAuNUV756Bkg6ytO8ZSW+mOs4Pp\\nP8y419vcduu5W2oyQZjVgKMQYd3Kgxl93y65VHKgDxLCFE5LndzLQ7iJ/U7qtXoN\\nzxyXUUUziQKBgQCv/er1l0z2oKI9NXviKXqV/qhdfV6C5XO/aH0LGR32BHcIIWgt\\n8qW464SuhQL5aHkFDBm2AHszfGX5ppU3zfWbOcSjyXMAY9gymyj5Sp0QJELxyRtA\\nVqqmOplNRIMqYisBM5EYeH4R6eqX+ehAd3hsqI35nLdgX257jn2eKHOW6wKBgE2S\\npK91Cg1NHBTFa5s+2r+QqvokKVf5I0TDcyvWRviPT1f0AQp2jbQ2nYsiNh1HnibP\\nmefVq5N6VXVSvxQ02u7W7Kk1ClDJCEjZOH8EI4svOA6wzB47w0KmyGCh7/y3L5gp\\nWlj1AauHnYEBztR/VfezV/JXdFL0TlnUg/ugFQmZAoGAQLhxIOxIZcoH7wG0qFB/\\nNPrXm0DLYAhrABfuvJlb5ziLCsY7dwEIAtAukY5wprWRGRtB25/D9Y3NGzNI+zgk\\nEj8qq0PuJnnyy7qjzFkqXDC3w2/l8agYqyLHlAjAg4rMjj7QVrEy3L9oTiDC2mV2\\nYJsAAgy5/rATBGO6VK7OvS8=\\n-----END PRIVATE KEY-----\\n\",\n" +
                "  \"client_email\": \"serverlessassignemnt@appspot.gserviceaccount.com\",\n" +
                "  \"client_id\": \"111213278333206106060\",\n" +
                "  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n" +
                "  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n" +
                "  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n" +
                "  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/serverlessassignemnt%40appspot.gserviceaccount.com\"\n" +
                "}";
        try {
            credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(creds.getBytes()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials)
                .setProjectId("serverlessassignemnt").build().getService();
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("text/plain").build();
        storage.create(blobInfo, fileArray);

        return "Successfully processed " + dynamodbEvent.getRecords().size() + " records.";

    }
}
