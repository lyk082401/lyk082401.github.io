import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

public class jksEmptyCertHook extends Object
{
	public static void main(String[] args)
	{
		createjks();
	}
	public static void createjks()
	{
		try
		{
			String pkg = "com.guoshi.httpcanary";
			// new java.io.File("/data/data/" + pkg + "/cache/HttpCanary.jks").createNewFile();
			/**BufferedReader br = */new BufferedReader(new InputStreamReader(Runtime.getRuntime().exec(new String[]{"/system/bin/sh", "-c", "touch /data/data/" + pkg + "/cache/HttpCanary.jks"}).getInputStream(), Charset.forName("UTF-8")));/**
			String line = null;
			while((line = br.readLine()) != null)
			{
				System.out.println(line);
			}*/
		}
		catch(Throwable e)
		{
			e.printStackTrace();
		}
	}
}