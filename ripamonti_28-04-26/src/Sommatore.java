import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Sommatore implements Runnable {
    private static int somma = 0;
    Lock l = new ReentrantLock();

    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            l.lock();
            somma += 1;
            l.unlock();
        }
        System.out.println("somma " + Thread.currentThread().getName() +  " = " +somma);
    }
}
